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
