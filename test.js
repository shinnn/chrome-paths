'use strict';

const {isAbsolute} = require('path');
const {promisify} = require('util');

const chromePaths = require('.');
const clearModule = require('clear-module');
const getStdout = require('execa').stdout;
const isexe = require('isexe');
const pretendPlatform = require('pretend-platform');
const test = require('tape');

test('chromePaths.chrome', async t => {
	try {
		// https://bugs.chromium.org/p/chromium/issues/detail?id=158372
		if (process.platform === 'win32') {
			t.ok(
				await promisify(isexe)(chromePaths.chrome),
				'should be a path of an application.'
			);
		} else {
			const stdout = await getStdout(chromePaths.chrome, ['--version']);

			t.ok(
				stdout.startsWith('Google Chrome'),
				`should be a path of ${stdout.trim()}.`
			);
		}
	} catch (err) {
		t.fail(err.stack);
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
			'chromium-browser',
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

test('chromePaths on an OS neither Linux, Windows and macOS', async t => {
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
