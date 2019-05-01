const chai = require('chai');
const sinon = require('sinon');
const cheerio = require('cheerio');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const { expect } = chai;

const HTMLMinifier = require('../HTMLMinifier');
const packageInfo = require('../package.json');

const mockHTML = `
  <html>
  <head>
    <title>Test HTML</title>
    <style>
      body {
        font-family: courier, monospace;
        color: green;
        background-color: black;
      }
    </style>
  </head>
  <body>
    <h1>Hello World!!!!</h1>
    <p>This is a test.</p>
  </body>
  </html>
`;

const wunderbucket = {
  $: cheerio.load(mockHTML),
  addAsset: (asset) => {
    console.log('asset', asset);
    return asset;
  },
}

describe('HTMLMinifier', () => {
  describe('process()', () => {
    it('should minify html', async () => {
      const result = await HTMLMinifier.process(wunderbucket);
      expect(result.indexOf('\n')).is.equal(-1);
    });
  });
});
