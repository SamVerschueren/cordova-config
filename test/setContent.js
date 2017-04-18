import test from 'ava';
import Config from '../';

test('add tag', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.setContent('test.html');

	t.is(config._root._children.length, 1);
	t.is(config._root._children[0].attrib.src, 'test.html');
	t.is(config._root._children[0].tag, 'content');
});

test('overwrite tag', t => {
	const config = new Config('fixtures/config.xml');
	config.setContent('test.html');

	const element = config._doc.find('./content');

	t.is(element.tag, 'content');
	t.is(element.attrib.src, 'test.html');
});
