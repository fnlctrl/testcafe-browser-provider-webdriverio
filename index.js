const wdio = require('webdriverio');

const { 
  REMOTE_HOST = '127.0.0.1', 
  REMOTE_PORT, 
  ENABLE_VIDEO, 
  ENABLE_VNC,
  CI,
  CI_COMMIT_REF_NAME,
  CI_COMMIT_SHA,
  HEARTBEAT
} = process.env;

module.exports = {
  // Send heartbeats to prevent Selenium server killing process due to timeout
  heartbeatInterval: parseInt(HEARTBEAT) || 30 * 1000,
  heartbeats: {},

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
    let [browserName, browserVersion] = browserString.split('@');
    let enableVideo = ENABLE_VIDEO === 'true';
    let enableVNC = ENABLE_VNC === 'true';

    let capabilities = {
      browserName,
      browserVersion,
      platformName,
      'appium:deviceName': deviceName,
      'selenoid:options': {
        enableVideo,
        enableVNC
      }
    };
    
    // Set video name for CI
    if (CI && enableVideo) {
      capabilities.videoName = `test-${new Date().toISOString()}-${CI_COMMIT_REF_NAME}-${CI_COMMIT_SHA.slice(0, 8)}.mp4`
    }
    let browser = await wdio.remote({
      capabilities,
      port: parseInt(REMOTE_PORT) || 4444,
      hostname: REMOTE_HOST.trim(),
      logLevel: CI ? 'silent' : 'error'
    });
    browser.navigateTo(pageUrl);
    this.browsers[id] = browser;
    this.heartbeats[id] = setInterval(() => {
      if (!this.heartbeats[id]) return;
      browser.getTitle().catch(() => {}); // suppress error
    }, this.heartbeatInterval);
  },

  async closeBrowser(id) {
    await this.browsers[id].deleteSession();
    delete this.browsers[id];
    clearInterval(this.heartbeats[id]);
    delete this.heartbeats[id];
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