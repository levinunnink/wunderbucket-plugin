const findPackage = require('read-pkg-up');
const WunderPluginError = require('./WunderPluginError');

/** Abstract class for Wunderbucket Plugins. All plugins must extend `WunderPlugin`. */
class WunderPlugin {
  static async packageInfo() {
    const result = await findPackage();
    return result.pkg;
  }

  /**
   * Get the plugin name from the package.json
   * @return {string} The plugin name
   */
  static async name() {
    const packageInfo = await WunderPlugin.packageInfo();
    return packageInfo.name;
  }

  /**
   * Get the plugin version from the package.json
   * @return The plugin version
   */
  static async version() {
    const packageInfo = await WunderPlugin.packageInfo();
    return packageInfo.version;
  }

  /**
   * Get the plugin description from the package.json
   * @return {string} The plugin description
   */
  static async description() {
    const packageInfo = await WunderPlugin.packageInfo();
    return packageInfo.description;
  }

  /**
   * Get the plugin author from the package.json
   * @return {string} The plugin author
   */
  static async author() {
    const packageInfo = await WunderPlugin.packageInfo();
    return packageInfo.author;
  }

  /**
   * Convert a file path to HTML for Wunderbucket to process. This is the first hook
   * before any processing happens.
   * @example
   * // An example of a converter plugin that extends this method and coverts
   * // markdown to html for Wunderbucket to upload
   * const WunderPlugin = require('wunderbucket-plugin');
   * const { Converter }  = require('showdown');
   * const path = require('path');
   * const fs = require('fs');
   *
   * class MarkdownConverter extends WunderPlugin
   * {
   *    static async convert(filePath) {
   *      if(path.extname(filePath) !== '.md') return false;
   *      const showdownConverter = new Converter();
   *      const markdownText = fs.readFileSync(filePath, 'utf8');
   *      const htmlText = showdownConverter.makeHtml(markdownText);
   *      const newPath = filePath.replace(path.extname(filePath), '.html');
   *      fs.writeFileSync(newPath, htmlText, 'utf8');
   *      return newPath;
   *    }
   * }
   * @param {string} filePath - The path to the file to convert
   * @return {string|Promise} The path to the converted file. Always ends in `.html`
   */
  static async convert(filePath) {
    throw new WunderPluginError('convert() not implemented');
  }

  /**
   * Process the HTML before uploading to Wunderbucket. This is the last hook before uploading.
   * @example
   * // An example of a processing plugin that extends this method and
   * // returns mimified HTML
   * const WunderPlugin = require('wunderbucket-plugin');
   * const { minify } = require('html-minifier');
   *
   * class HTMLMinifier extends WunderPlugin {
   * static async process(compilerContext) {
   *    const html = minify(compilerContext.$.html(), {
   *         minifyCSS: true,
   *         minifyJS: true,
   *         collapseWhitespace: true,
   *      });
   *      return html;
   *   }
   * }
   *
   * module.exports = HTMLMinifier;
   *
   * @param {object} compilerContext - An object that contains a HTML dom and all
   * the extracted assets from the HTML.
   * @return {string|Promise} The converted HTML. Must be valid HTML.
   */
  static async process(compilerContext) {
    throw new WunderPluginError('process() not implemented');
  }

  /**
   * Process an indivdiual asset before uploading to WunderBucket.
   *
   * <strong>Important:</strong> If your plugin implements this method any asset that
   * is passed to it will be <strong>removed from the upload</strong>, unless the
   * method throws an error.
   * @example
   * // An example of an image encoding plugin that extends this method and
   * // returns the processed asset
   * const WunderPlugin = require('wunderbucket-plugin');
   * const { WunderPluginError } = WunderPlugin;
   * const fs = require('fs');
   *
   * class ImageEncoder extends WunderPlugin {
   *   static processAsset(complilerContext, extractorResult) {
   *     const bitmap = ImageEncoder.getFileData(extractorResult.path);
   *     const encoded = Buffer.from(bitmap).toString('base64');
   *     let data;
   *     switch (extractorResult.type) {
   *        case 'image/png':
   *          data = `data:image/png;base64,${encoded}`;
   *          break;
   *        case 'image/jpeg':
   *          data = `data:image/jpeg;base64,${encoded}`;
   *          break;
   *        case 'image/gif':
   *          data = `data:image/jpeg;base64,${encoded}`;
   *          break;
   *        case 'image/svg':
   *          data = `data:image/svg+xml;base64,${encoded}`;
   *          break;
   *        default:
   *          throw new WunderPluginError('Asset type not supported');
   *          break;
   *     }
   *     const encodedData = data;
   *
   *     complilerContext.$(`*[data-resource-id="${this.extractorResult.id}"]`)
   *        .attr('src', encodedData);
   *   }
   *
   *   static getFileData(filePath) {
   *     return fs.readFileSync(filePath);
   *   }
   * }
   *
   * module.exports = ImageEncoder;
   *
   * @param {object} compilerContext - An object that contains a HTML dom and all
   * the extracted assets from the HTML.
   * @return {void|Promise} This method should modify the dom and use the
   * `compilierContext.addAsset()` to add assets to the upload. It does not need to
   * return any value.
   */

  static async processAsset(compilerContext, asset) {
    throw new WunderPluginError('processAsset() not implemented');
  }
}

module.exports = WunderPlugin;
