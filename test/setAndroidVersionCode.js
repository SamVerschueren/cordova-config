import test from 'ava';
import Config from '../';

test('throw error', t => {
	const config = new Config('fixtures/config.xml');

	t.throws(config.setAndroidVersionCode.bind(config, 'ab'), 'Please provide a valid Android version code.');
	t.throws(config.setAndroidVersionCode.bind(config, '1.1'), 'Please provide a valid Android version code.');
	t.throws(config.setAndroidVersionCode.bind(config, '1a'), 'Please provide a valid Android version code.');
	t.throws(config.setAndroidVersionCode.bind(config, 'a1'), 'Please provide a valid Android version code.');
});

test('set Android version', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.setAndroidVersionCode('110');

	t.is(config._root.attrib['android-versionCode'], '110');
});

test('overwrite Android version', t => {
	const config = new Config('fixtures/config.xml');
	config.setAndroidVersionCode(110);

	console.log(config._root.attrib['android-versionCode']);

	t.is(config._root.attrib['android-versionCode'], 110);
});
