const WunderPlugin = require('wunderbucket-plugin');
const fs = require('fs');

class ImageEncoder extends WunderPlugin {
  static processAsset(complilerContext, extractorResult) {
    return new Promise((resolve) => {
      const bitmap = ImageEncoder.getFileData(extractorResult.path);
      const encoded = Buffer.from(bitmap).toString('base64');
      let data;
      if (extractorResult.path.indexOf('.png') !== -1) {
        data = `data:image/png;base64,${encoded}`;
      }
      if (extractorResult.path.indexOf('.jpeg') !== -1 || extractorResult.path.indexOf('.jpg') !== -1) {
        data = `data:image/jpeg;base64,${encoded}`;
      }
      if (extractorResult.path.indexOf('.gif') !== -1) {
        data = `data:image/gif;base64,${encoded}`;
      }
      if (extractorResult.path.indexOf('.svg') !== -1) {
        data = `data:image/svg+xml;base64,${encoded}`;
      }
      const encodedData = data;

      complilerContext.$(`*[data-resource-id="${this.extractorResult.id}"]`).attr('src', encodedData);
      resolve();
    });
  }

  static getFileData(filePath) {
    return fs.readFileSync(filePath);
  }
}

module.exports = ImageEncoder;
