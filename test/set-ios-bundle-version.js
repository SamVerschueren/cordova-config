import test from 'ava';
import Config from '../';

test('throw error', t => {
	const config = new Config('fixtures/config.xml');

	t.throws(config.setIOSBundleVersion.bind(config, 'ab'), 'Please provide a valid iOS bundle version number.');
	t.throws(config.setIOSBundleVersion.bind(config, '0'), 'Please provide a valid iOS bundle version number.');
	t.throws(config.setIOSBundleVersion.bind(config, '0.1'), 'Please provide a valid iOS bundle version number.');
	t.throws(config.setIOSBundleVersion.bind(config, '0.1.1'), 'Please provide a valid iOS bundle version number.');
	t.throws(config.setIOSBundleVersion.bind(config, '1.1.1.1'), 'Please provide a valid iOS bundle version number.');
	t.throws(config.setIOSBundleVersion.bind(config, 'a.b.c'), 'Please provide a valid iOS bundle version number.');
	t.throws(config.setIOSBundleVersion.bind(config, '1..1'), 'Please provide a valid iOS bundle version number.');
	t.throws(config.setIOSBundleVersion.bind(config, '1.1.'), 'Please provide a valid iOS bundle version number.');
});

test('not throw error', t => {
	const config = new Config('fixtures/config.xml');

	t.notThrows(config.setIOSBundleVersion.bind(config, '1'));
	t.notThrows(config.setIOSBundleVersion.bind(config, '1.1'));
	t.notThrows(config.setIOSBundleVersion.bind(config, '1.1.1'));
});

test('set iOS Bundle version', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.setIOSBundleVersion('1.1.1');

	t.is(config._root.attrib['ios-CFBundleVersion'], '1.1.1');
});

test('overwrite iOS Bundle version', t => {
	const config = new Config('fixtures/config.xml');
	config.setIOSBundleVersion('1.0');

	t.is(config._root.attrib['ios-CFBundleVersion'], '1.0');
});
