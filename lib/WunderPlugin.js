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
   * Convert a file path to HTML for Wunderbucket to process. This is the first hook before any processing happens.
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
   * @return {string} The path to the converted file. Always ends in `.html`
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
   * @return {string} The converted HTML. Must be valid HTML.
   */
  static async process(compilerContext) {
    throw new WunderPluginError('process() not implemented');
  }

  static async processAsset(compilerContext, asset) {
    throw new WunderPluginError('processAsset() not implemented');
  }
}

module.exports = WunderPlugin;
