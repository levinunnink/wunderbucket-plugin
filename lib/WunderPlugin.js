const findPackage = require('read-pkg-up');
const WunderPluginError = require('./WunderPluginError');

class WunderPlugin {
  static async packageInfo() {
    const result = await findPackage();
    return result.pkg;
  }

  static async name() {
    const packageInfo = await WunderPlugin.packageInfo();
    return packageInfo.name;
  }

  static async version() {
    const packageInfo = await WunderPlugin.packageInfo();
    return packageInfo.version;
  }

  static async description() {
    const packageInfo = await WunderPlugin.packageInfo();
    return packageInfo.description;
  }

  static async author() {
    const packageInfo = await WunderPlugin.packageInfo();
    return packageInfo.author;
  }

  static async convert(filePath, cb) {
    throw new WunderPluginError('convert() not implemented');
  }

  static async process(compilerContext, cb = null) {
    throw new WunderPluginError('process() not implemented');
  }

  static async processAsset(compilerContext, asset, cb = null) {
    throw new WunderPluginError('processAsset() not implemented');
  }
}

module.exports = WunderPlugin;
