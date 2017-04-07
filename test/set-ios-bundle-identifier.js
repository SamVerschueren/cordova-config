import test from 'ava';
import Config from '../';

test('set invalid bundle identifier', t => {
	const config = new Config('fixtures/config.xml');
	t.throws(config.setIOSBundleIdentifier.bind(config, 'my-failing bundle identifier 6'), Error);
});

test('set bundle identifier', t => {
	const config = new Config('fixtures/config.xml');
	config.setIOSBundleIdentifier('com.my.app');

	t.is(config._root.attrib['ios-CFBundleIdentifier'], 'com.my.app');
});
