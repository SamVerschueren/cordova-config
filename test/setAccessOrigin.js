import test from 'ava';
import Config from '../';

test('add access origin', t => {
	const config = new Config('fixtures/config.xml');
	config.setAccessOrigin('http://my.api.com');

	t.is(config._root.findall('./access').length, 3);
});

test('add access origin with an option', t => {
	const config = new Config('fixtures/config.xml');
	config.setAccessOrigin('https://*', {'launch-external': 'yes'});

	const tag = config._root.find('./access/[@origin="https://*"]');

	t.is(tag.attrib['launch-external'], 'yes');
});

test('add access origin with multiple options', t => {
	const config = new Config('fixtures/config.xml');
	config.setAccessOrigin('https://*', {a: 'b', c: 'd', e: 'f'});

	const tag = config._root.find('./access/[@origin="https://*"]');

	t.is(tag.attrib.a, 'b');
	t.is(tag.attrib.c, 'd');
	t.is(tag.attrib.e, 'f');
});

test('replace existing access origin', t => {
	const config = new Config('fixtures/config.xml');
	config.setAccessOrigin('*', {'launch-external': 'yes'});

	const tag = config._root.find('./access/[@origin="*"]');

	t.is(tag.attrib['launch-external'], 'yes');
});
