const { minify } = require('html-minifier');
const WunderPlugin = require('../../index');

class HTMLMinifier extends WunderPlugin {
  static async process(wunderbucket) {
    const html = minify(wunderbucket.$.html(), {
      minifyCSS: true,
      minifyJS: true,
      collapseWhitespace: true,
    });
    wunderbucket.$ = wunderbucket.$.load(html); // eslint-disable-line
  }
}

module.exports = HTMLMinifier;
