import test from 'ava';
import Config from '../';

test('add tag', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.setDescription('Foo Description');

	t.is(config._root._children.length, 1);
	t.is(config._root._children[0].tag, 'description');
	t.is(config._root._children[0].text, 'Foo Description');
});

test('overwrite tag', t => {
	const config = new Config('fixtures/config.xml');
	config.setDescription('Foo Description');

	const element = config._doc.find('./description');

	t.is(element.tag, 'description');
	t.is(element.text, 'Foo Description');
});
