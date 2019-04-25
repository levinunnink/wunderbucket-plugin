const findPackage = require('read-pkg-up');
const path = require('path');
const os = require('os');
const fs = require('fs');

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
    if (cb) return cb();
    return null;
  }

  static async process($, cb = null) {
    if (cb) return cb($);
    return $;
  }

  static async processAsset(asset, cb = null) {
    if (cb) return cb(asset);
    return asset;
  }
}

module.exports = WunderPlugin;
