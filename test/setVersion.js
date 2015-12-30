import test from 'ava';
import Config from '../';

test('throw error', t => {
	const config = new Config('fixtures/config.xml');

	t.throws(config.setVersion.bind(config, 'ab'), 'Please provide a valid version number.');
	t.throws(config.setVersion.bind(config, '1'), 'Please provide a valid version number.');
	t.throws(config.setVersion.bind(config, '1.1'), 'Please provide a valid version number.');
	t.throws(config.setVersion.bind(config, '1.1.1.1'), 'Please provide a valid version number.');
	t.throws(config.setVersion.bind(config, 'a.b.c'), 'Please provide a valid version number.');
	t.throws(config.setVersion.bind(config, '1..1'), 'Please provide a valid version number.');
	t.throws(config.setVersion.bind(config, '1.1.'), 'Please provide a valid version number.');
});

test('set version', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.setVersion('1.1.1');

	t.is(config._root.attrib.version, '1.1.1');
});

test('overwrite version', t => {
	const config = new Config('fixtures/config.xml');
	config.setVersion('1.1.1');

	t.is(config._root.attrib.version, '1.1.1');
});
