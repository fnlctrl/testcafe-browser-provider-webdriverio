# testcafe-browser-provider-webdriverio

This is the **webdriverio** browser provider plugin for [TestCafe](http://devexpress.github.io/testcafe). It uses the latest version of [webdriverio](https://github.com/webdriverio/webdriverio/) to connect to Selenium/Appium server.

## Install

```
npm install -D https://github.com/fnlctrl/testcafe-browser-provider-webdriverio.git
```

## Prerequisites

A selenium compatible server (Selenium, Selenoid, Zalenium,  Appium, etc.) up and running.

Also note that this plugin requires node>=7.6 with native async/await support

## Usage

If you run tests from the command line, use the browser alias when specifying browsers. The '-c 2' parameter will split the tests up and run them across two browsers concurrently. Omit this if it is not needed.

```
testcafe -c 2 webdriverio:chrome 'path/to/test/file.js'
```

When you use API, pass the alias to the `browsers()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('webdriverio:chrome')
    .concurrency(2)
    .run();
```

### Specifying the Browser/Platform/Device
The browser version and platform can be specified along with the browser name alias in the format:
```
webdriverio:browserName[@version][:platform][:device]
```
For example:
* webdriverio:chrome
* webdriverio:chrome@52.0
* webdriverio:chrome@52.0:linux

When using with Appium server, device name must be specified:
* webdriverio:chrome:android:my-device-name

for android devices, device names can be found with `adb devices`

## Configuration

Use the following optional environment variable to set additional configuration options:

 - `REMOTE_HOST` - (optional) the hostname to the remote server. Default: 'localhost'.

 - `REMOTE_PORT` - (optional) the port to the remote server. Default: '4444'.
 
 - `ENABLE_VNC` - (optional) use `ENABLE_VNC=true` to add `enableVNC: true` in `capabilities` option for webdriverio. Default: false.
