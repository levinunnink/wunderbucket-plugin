class WunderPluginError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WunderPluginError';
  }
}

module.exports = WunderPluginError;
