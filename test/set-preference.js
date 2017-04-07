import test from 'ava';
import Config from '../';

test('add tag', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.setPreference('ShowTitle', false);

	const preference = config._doc.find('./preference/[@name="ShowTitle"]');

	t.is(preference.attrib.name, 'ShowTitle');
	t.false(preference.attrib.value);
});

test('overwrite tag', t => {
	const config = new Config('fixtures/config.xml');
	config.setPreference('ShowTitle', false);

	const preference = config._doc.find('./preference/[@name="ShowTitle"]');

	t.is(preference.attrib.name, 'ShowTitle');
	t.false(preference.attrib.value);
});
