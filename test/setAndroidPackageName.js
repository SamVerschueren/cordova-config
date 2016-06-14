import test from 'ava';
import Config from '../';

test('set invalid package name', t => {
	const config = new Config('fixtures/config.xml');
	t.throws(config.setAndroidPackageName.bind(config, 'my-failing packagename 6'), Error);
});

test('set packageName', t => {
	const config = new Config('fixtures/config.xml');
	config.setAndroidPackageName('com.my.app');

	t.is(config._root.attrib['android-packageName'], 'com.my.app');
});
