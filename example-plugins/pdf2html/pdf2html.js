const PDFConverter = require('pdftohtmljs');
const path = require('path');
const WunderPlugin = require('../../index');

class PDF2HTML extends WunderPlugin {
  static async convert(filePath) {
    const pdfName = path.basename(filePath, '.pdf');
    const assetName = `${pdfName}.html`;
    await PDF2HTML.convertPDF(filePath, assetName);
    return path.join(path.dirname(filePath), assetName);
  }

  static async convertPDF(filePath, assetName) {
    const converter = new PDFConverter(filePath, assetName);
    converter.add_options([
      `--dest-dir ${path.dirname(filePath)}`,
    ]);
    return converter.convert();
  }
}

module.exports = PDF2HTML;
