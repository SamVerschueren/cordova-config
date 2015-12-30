import test from 'ava';
import Config from '../';

test('add tag', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.setName('FooBar');

	t.is(config._root._children.length, 1);
	t.is(config._root._children[0].tag, 'name');
	t.is(config._root._children[0].text, 'FooBar');
});

test('overwrite tag', t => {
	const config = new Config('fixtures/config.xml');
	config.setName('FooBar');

	const element = config._doc.find('./name');

	t.is(element.tag, 'name');
	t.is(element.text, 'FooBar');
});
