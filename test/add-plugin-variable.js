import test from 'ava';
import Config from '../';

test('add a new plugin', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.addPluginVariable('earth');

	t.is(config._root._children.length, 1);
	t.is(config._root._children[0].tag, 'plugin');
	t.is(config._root._children[0].attrib.name, 'earth');
});

test('add a new plugin with a variable', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.addPluginVariable('earth', 'id', '123');

	t.is(config._root._children.length, 1);
	t.is(config._root._children[0].tag, 'plugin');
	t.is(config._root._children[0].attrib.name, 'earth');
	t.is(config._root._children[0]._children.length, 1);
	t.is(config._root._children[0]._children[0].tag, 'variable');
	t.is(config._root._children[0]._children[0].attrib.name, 'id');
	t.is(config._root._children[0]._children[0].attrib.value, '123');
});

test('add multiple variables to a plugin', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.addPluginVariable('earth', 'id', '123');
	config.addPluginVariable('earth', 'color', 'blue');

	t.is(config._root._children.length, 1);
	t.is(config._root._children[0].tag, 'plugin');
	t.is(config._root._children[0].attrib.name, 'earth');
	t.is(config._root._children[0]._children.length, 2);
	t.is(config._root._children[0]._children[0].tag, 'variable');
	t.is(config._root._children[0]._children[0].attrib.name, 'id');
	t.is(config._root._children[0]._children[0].attrib.value, '123');
	t.is(config._root._children[0]._children[1].tag, 'variable');
	t.is(config._root._children[0]._children[1].attrib.name, 'color');
	t.is(config._root._children[0]._children[1].attrib.value, 'blue');
});

test('add a new variable to an existing plugin', t => {
	const config = new Config('fixtures/config.plugin.xml');
	config.addPluginVariable('earth', 'id', '123');

	t.is(config._root._children.length, 1);
	t.is(config._root._children[0].tag, 'plugin');
	t.is(config._root._children[0].attrib.name, 'earth');
	t.is(config._root._children[0]._children.length, 1);
	t.is(config._root._children[0]._children[0].tag, 'variable');
	t.is(config._root._children[0]._children[0].attrib.name, 'id');
	t.is(config._root._children[0]._children[0].attrib.value, '123');
});
