/* eslint-disable no-var, prefer-template */
'use strict';

var karmaChromeLauncher = require('karma-chrome-launcher');

[
	'chrome',
	'chromeCanary',
	'chromium'
].forEach(function setProp(propertyName) {
	exports[propertyName] = karmaChromeLauncher[
	'launcher:' +
		propertyName.charAt(0).toUpperCase() +
		propertyName.slice(1)
	][1].prototype.DEFAULT_CMD[process.platform] || null;
});

/*
const karmaChromeLauncher = require('karma-chrome-launcher');

for (const propertyName of [
	'chrome',
	'chromeCanary',
	'chromium'
]) {
	exports[propertyName] = karmaChromeLauncher[`launcher:${
		propertyName.charAt(0).toUpperCase()
	}${
		propertyName.slice(1)
	}`][1].prototype.DEFAULT_CMD[process.platform] || null;
}
*/
