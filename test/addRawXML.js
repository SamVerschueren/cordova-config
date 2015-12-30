import test from 'ava';
import Config from '../';

test('add access origin with an option', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.addRawXML(`
	<platform name="android">
		<icon src="res/android/ldpi.png" density="ldpi" />
		<icon src="res/android/mdpi.png" density="mdpi" />
	</platform>
	`);

	const tag = config._root.find('./platform/[@name="android"]');

	t.is(tag._children.length, 2);
});
