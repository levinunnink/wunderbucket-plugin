const chai = require('chai');
const sinon = require('sinon');
const cheerio = require('cheerio');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const { expect } = chai;

const OpenGraph = require('../OpenGraph');
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
    return asset;
  },
}

describe('OpenGraph', () => {
  beforeEach(() => {
    sinon.stub(OpenGraph, 'screenshot').resolves('foo');
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('process()', () => {
    it('should add open graph tags to a HTML data when they don\'t exist', async () => {
      await OpenGraph.process(wunderbucket);
      expect(wunderbucket.$('meta[property="og:title"]').length).to.eq(1);
    });
    it('should add open graph image preview of the HTML when it doesn\'t exist', async () => {
      await OpenGraph.process(wunderbucket);
      expect(wunderbucket.$('meta[property="og:image"]').length).to.be.greaterThan(0)
    });
  });
});
