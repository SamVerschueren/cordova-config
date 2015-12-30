import test from 'ava';
import Config from '../';

function construct(file) {
	return new Config(file);
}

test('error if file could not be found', t => {
	t.throws(construct.bind(undefined, 'config.xml'), Error);
});

test('error if root tag is not <widget>', t => {
	t.throws(construct.bind(undefined, 'fixtures/config.wrong.xml'), 'fixtures/config.wrong.xml has incorrect root node name (expected "widget", was "foo")');
});

test('parse file', t => {
	const config = new Config('fixtures/config.xml');

	t.is(config._root.tag, 'widget');
	t.is(config._root.attrib.id, 'cordova-config');
	t.is(config._root.attrib.version, '0.0.1');
	t.is(config._root._children.length, 7);
});

test('BOM', t => {
	const config = new Config('fixtures/config.bom.xml');

	t.is(config._root.tag, 'widget');
	t.is(config._root.attrib.id, 'cordova-config');
	t.is(config._root.attrib.version, '0.0.1');
	t.is(config._root._children.length, 5);
});
