const { minify } = require('html-minifier');
const WunderPlugin = require('wunderbucket-plugin');

class HTMLMinifier extends WunderPlugin {
  static async process(wunderbucket) {
    const html = minify(wunderbucket.$.html(), {
      minifyCSS: true,
      minifyJS: true,
      collapseWhitespace: true,
    });
    return html;
  }
}

module.exports = HTMLMinifier;
