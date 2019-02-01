'use strict';

const {execFile} = require('child_process');
const {isAbsolute} = require('path');
const {promisify} = require('util');

const chromePaths = require('.');
const clearModule = require('clear-module');
const isexe = require('isexe');
const pretendPlatform = require('pretend-platform');
const test = require('tape');

test('chromePaths.chrome', async t => {
	if (process.platform === 'win32') {
		t.ok(
			await promisify(isexe)(chromePaths.chrome),
			'should be a path of an application.'
		);
	} else {
		const {stdout} = await promisify(execFile)(chromePaths.chrome, ['--version']);

		t.ok(
			stdout.startsWith('Google Chrome'),
			`should be a path of ${stdout.trim()}.`
		);
	}

	t.end();
});

test('chromePaths.chromeCanary', t => {
	if (process.platform === 'linux') {
		t.equal(
			chromePaths.chromeCanary,
			null,
			'should be null as Canary is not provided for Linux.'
		);
	} else {
		t.ok(
			isAbsolute(chromePaths.chromeCanary),
			'should be an absolute path.'
		);
	}

	t.end();
});

test('chromePaths.chromium', t => {
	if (process.platform === 'linux') {
		t.equal(
			chromePaths.chromium,
			'chromium',
			'should be a binary name on Linux.'
		);
	} else {
		t.ok(
			isAbsolute(chromePaths.chromium),
			'should be an absolute path.'
		);
	}

	t.end();
});

test('chromePaths on an OS neither Linux, Windows nor macOS', async t => {
	clearModule('.');
	clearModule('karma-chrome-launcher');
	pretendPlatform('sunos');

	const solarisChromePaths = require('.');

	t.deepEqual(
		solarisChromePaths,
		{
			chrome: null,
			chromeCanary: null,
			chromium: null
		},
		'should have no paths.'
	);

	t.end();
});
