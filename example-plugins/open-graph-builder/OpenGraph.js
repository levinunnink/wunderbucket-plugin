// const webshot = require('node-webshot');
const WunderPlugin = require('../../index');

class OpenGraph extends WunderPlugin {
  static async screenshot(html) {
    return new Promise((resolve) => {
      const outpath = `${__dirname}/assets/screenshot.png`;
      // Disabled for tests
      // webshot(html, outpath, {
      //   screenSize: {
      //     width: 1200,
      //     height: 630,
      //   },
      //   siteType: 'html',
      // }, () => resolve(outpath));
      resolve(outpath);
    });
  }

  static async process(wunderbucket) {
    if (!wunderbucket.$("head meta[property='og:title']").length) {
      const title = wunderbucket.$('head title').text();
      wunderbucket.$('head').append(`
        <meta property="og:title" content="${title}" />
      `);
    }
    if (!wunderbucket.$("head meta[property='og:image']").length) {
      const outpath = await OpenGraph.screenshot(wunderbucket.$.html());
      const link = wunderbucket.addAsset(outpath);
      wunderbucket.$('head').append(`
        <meta property="og:image" content="${link}" />
      `);
    }
  }
}

module.exports = OpenGraph;
