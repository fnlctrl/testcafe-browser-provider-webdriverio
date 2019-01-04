const wdio = require('webdriverio');

module.exports = {
  // Multiple browsers support
  isMultiBrowser: true,

  // Keep track of opened browsers
  browsers: {},

  // Required - must be implemented
  // Browser control
  /**
   * @param {String} target - <browserName@browserVersion>:<platformName>:<deviceName>
   * e.g. chrome:linux
   * e.g. chrome:android:nx505j
   */
  async openBrowser(id, pageUrl, target) {
    if (!target) throw new Error('Browser name must be specified!');
    let [browserString, platformName, deviceName] = target.split(':');
    let [browserName, browserVersion] = browserString.split('@')
    let browser = await wdio.remote({
      capabilities: {
        browserName,
        browserVersion,
        platformName,
        deviceName,
        enableVNC: process.env.ENABLE_VNC === 'true'
      },
      port: parseInt(process.env.REMOTE_PORT) || 4444,
      hostname: process.env.REMOTE_HOST,
      logLevel: 'error'
    });
    browser.navigateTo(pageUrl);
    this.browsers[id] = browser;
  },

  async closeBrowser(id) {
    this.browsers[id].deleteSession();
    delete this.browsers[id];
  },


  // Optional - implement methods you need, remove other methods
  // Initialization
  async init() {
    return;
  },

  async dispose() {
    return;
  },

  // Browser names handling
  async getBrowserList() {
    throw new Error('Not implemented!');
  },

  async isValidBrowserName(/* browserName */) {
    return true;
  },

  // Extra methods
  async resizeWindow(/* id, width, height, currentWidth, currentHeight */) {
    this.reportWarning('The window resize functionality is not supported.');
  },

  async takeScreenshot(/* id, screenshotPath, pageWidth, pageHeight */) {
    this.reportWarning('The screenshot functionality is not supported.');
  }
};