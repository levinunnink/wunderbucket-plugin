# wunderbucket-plugin

[![npm version](https://badge.fury.io/js/wunderbucket-plugin.svg)](https://badge.fury.io/js/wunderbucket-plugin) [![Build Status](https://travis-ci.com/levinunnink/wunderbucket-plugin.svg?branch=master)](https://travis-ci.com/levinunnink/wunderbucket-plugin) [![license](https://img.shields.io/npm/l/wunderbucket-plugin.svg)](https://www.npmjs.com/package/wunderbucket-plugin)

WunderBucket plugins are designed to be easy to create if you have a basic knowledge of Javascript and HTML.
They follow a simple system of three different methods or "hooks" which will be called in sequence when you run the 
WunderBucket CLI. The goal of the plugin framework is to give developers a simple wrapper to for converting files to HTML, 
process the assets inside that HTML file, and finally processing the HTML output before uploading to WunderBucket.

WunderBucket is _not_ a preprocessor or a replacement for Webpack or Babel or anything like that. WunderBucket plugins
are meant to take already valid HTML output and do some extra stuff before it's uploaded.

# Hooks

There are three different hooks that are run sequentally before the final result is uploaded to WunderBucket. 
Plugins can implement all hook methods or only one.

All methods are `static` and `async`. Plugins must extend `WunderPlugin` otherwise they will not be called 
by the WunderBucket CLI.

## convert(filePath)

Plugins should implement this method to convert non-html files to html for further processing by WunderBucket.

**Example use cases:** Converting a Markdown File to HTML, generating JSDoc output from a file, convert a PDF to HTML.

**Example plugin:**

```js
// An example of a converter plugin that extends this method and coverts
// markdown to html for Wunderbucket to upload
const WunderPlugin = require('wunderbucket-plugin');
const { Converter }  = require('showdown');
const path = require('path');
const fs = require('fs');

class MarkdownConverter extends WunderPlugin {
  static async convert(filePath) {
    if(path.extname(filePath) !== '.md') return false;
    const showdownConverter = new Converter();
    const markdownText = fs.readFileSync(filePath, 'utf8');
    const htmlText = showdownConverter.makeHtml(markdownText);
    const newPath = filePath.replace(path.extname(filePath), '.html');
    fs.writeFileSync(newPath, htmlText, 'utf8');
    return newPath;
  }
}

module.exports = MarkdownConverter;

```

[convert() API docs](https://api.wunderbucket.io/plugins/index.html#wunderpluginconvert)

## processAsset(compilierContext, extractorResult)

Plugins should implement this method to process assets that are linked in the HTML file.

A few considerations for the `processAsset` method: 

- If the plugin will not process the asset it should throw a `WunderPluginError`.
- If a plugin wants to remove the original asset from the upload (say it embedded the image as a data url). It should return
`null` or `undefined`.
- If a plugin wants to upload a modified asset it should return a modified `extractorResult` object.

**Example use cases:** Compress images, convert linked images to data urls, convert linked videos to mobile-friendly format.

**Example plugin:**

```js
// An example of a converter plugin that extends this method and coverts
// markdown to html for Wunderbucket to upload
const WunderPlugin = require('wunderbucket-plugin');
const { WunderPluginError } = WunderPlugin;
const fs = require('fs');

class ImageEncoder extends WunderPlugin {
  static async processAsset(complilerContext, extractorResult) {
    const bitmap = ImageEncoder.getFileData(extractorResult.path);
    const encoded = Buffer.from(bitmap).toString('base64');
    let data;
    switch(extractorResult.type)
    {
      case 'image/png':
        data = `data:image/png;base64,${encoded}`;
        break;
      case 'image/jpeg':
        data = `data:image/jpeg;base64,${encoded}`;
        break;
      case 'image/gif':
        data = `data:image/gif;base64,${encoded}`;
        break;
      case 'image/svg':
        data = `data:image/svg+xml;base64,${encoded}`;
        break;
      default:
        throw new WunderPluginError('Asset not supported');
        break;
    }
    complilerContext.$(`*[data-resource-id="${this.extractorResult.id}"]`).attr('src', data);
  }

  static getFileData(filePath) {
    return fs.readFileSync(filePath);
  }
}

module.exports = ImageEncoder;
```

[convert() API docs](https://api.wunderbucket.io/plugins/index.html#wunderpluginprocessasset)

## process(compilerContext)

Plugins should implement this method to modify the final HTML output before upload. This method must return a valid HTML string.

**Example use cases:** Mimify HTML, add meta tags, update copyrights

```js
// An example of a processing plugin that extends this method and
// returns mimified HTML
const { minify } = require('html-minifier');
const WunderPlugin = require('wunderbucket-plugin');

class HTMLMinifier extends WunderPlugin {
  static async process(compilerContext) {
    const html = minify(compilerContext.$.html(), {
      minifyCSS: true,
      minifyJS: true,
      collapseWhitespace: true,
    });
    return html;
  }
}

module.exports = HTMLMinifier;
```
[process() API docs](https://api.wunderbucket.io/plugins/index.html#wunderpluginprocess)

# The CompilerContext object

The CompilerContext object allows you to query and modify the HTML document as it's being processed by WunderBucket using the JQuery API.

**Properties**
- `$`: A [jQuery](https://jquery.com/) compatible object with the HTML dom loaded into it. Any changes you make will be applied to the uploaded HTML.
- `assets`: An array of all the detected assets to be uploaded with the HTML file. JS and CSS files are excluded.

## Modifying the CompilerContext dom

You can use the `$` property to make changes to the HTML before it's uploaded. For example:

Your initial HTML file could look like this:

```html
<html>
  <body>
    <p>Hi</p>
  </body>
</html>
```

and your plugin could do this in the `process()` hook

```js
static async process(compilerContext) {
  compilerContext.$('p').text('FooBar');
  return compilerContext.$.html();
}
```

And the file that gets uploaded would look like this:

```html
<html>
  <body>
    <p>FooBar</p>
  </body>
</html>
```

# Installing your plugin

You can install and test your WunderBucket plugin using the WunderBucket CLI like so:

**Installing a plugin locally:**

```bash
$ wunderbucket install-plugin /path/to/your/plugin
```

**Installing a plugin from a gitup repo:**

```bash
$ wunderbucket install-plugin AccountName/RepositoryName
```

**Installing a plugin from a NPM module:**

```bash
$ wunderbucket install-plugin module-name
```

# Plugins

Plugin | Hook | Description
------|--------|-----------
[wunderbucket-html-mimifier](/example-plugins/html-mimifier) | `process()` | Mimifies the processed HTML file for faster loading
[wunderbucket-open-graph-builder](/example-plugins/open-graph-builder) | `process()` | Adds open graph tags to the HTML and if they don't already exist
[wunderbucket-pdf2html](/example-plugins/pdf2html) | `convert()` | Converts PDF files to HTML to be processed by Wunderbucket
[wunderbucket-base64-image-encoder](/example-plugins/base64image-encoder) | `processAsset()` | Base64 encodes and embeds images into the HTML to improve performance

If you would like us to list your plugin here, please get in touch.

# Authors

- [Levi Nunnink](https://nunn.ink)