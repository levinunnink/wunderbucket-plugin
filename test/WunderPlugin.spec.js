const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const { expect } = chai;

const WunderPlugin = require('../lib/WunderPlugin');
const packageInfo = require('../package.json');

describe('WunderPlugin', () => {
  describe('version()', () => {
    it('should return the package version for the plugin version', async () => {
      const version = await WunderPlugin.version();
      expect(version).to.eql(packageInfo.version);
    });
  });
  describe('author()', () => {
    it('should return the package author for the plugin author', async () => {
      const author = await WunderPlugin.author();
      expect(author.name).to.eql(packageInfo.author);
    });
  });
  describe('name()', () => {
    it('should return the package name for the plugin name', async () => {
      const name = await WunderPlugin.name();
      expect(name).to.eql(packageInfo.name);
    });
  });
  describe('description()', () => {
    it('should return the package description for the plugin description', async () => {
      const description = await WunderPlugin.description();
      expect(description).to.eql(packageInfo.description);
    });
  });
});