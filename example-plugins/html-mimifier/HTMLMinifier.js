const { minify } = require('html-minifier');
const WunderPlugin = require('../../index');

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
