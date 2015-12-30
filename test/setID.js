import test from 'ava';
import Config from '../';

test('throw error if id has non IRI character', t => {
	const config = new Config('fixtures/config.xml');

	t.throws(config.setID.bind(config, '*.wrongid.com'), Error);
	t.throws(config.setID.bind(config, '$.wrongid.com'), Error);
	t.throws(config.setID.bind(config, '.com.com'), Error);
});

test('set ID', t => {
	const config = new Config('fixtures/config.xml');
	config.setID('com.my.app');

	t.is(config._root.attrib.id, 'com.my.app');
});
