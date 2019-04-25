const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const path = require('path');
chai.use(sinonChai);
const { expect } = chai;

const PDFPlugin = require('../pdf2html');

describe('pdf2html', () => {
  beforeEach(() => {
    sinon.stub(PDFPlugin, 'convertPDF').resolves();
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('convert()', () => {
    it('should convert the pdf to html', async () => {
      const result = await PDFPlugin.convert(`${__dirname}/test.pdf`);
      expect(path.extname(result)).to.eql('.html');
    });
  });
});
