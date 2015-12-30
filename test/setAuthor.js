import test from 'ava';
import Config from '../';

test('add tag', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.setAuthor('John Doe');

	t.is(config._root._children.length, 1);
	t.is(config._root._children[0].tag, 'author');
	t.is(config._root._children[0].text, 'John Doe');
	t.same(config._root._children[0].attrib, {});
});

test('add tag with email attribute', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.setAuthor('John Doe', 'john.doe@testers.com');

	t.is(config._root._children.length, 1);
	t.is(config._root._children[0].tag, 'author');
	t.is(config._root._children[0].text, 'John Doe');
	t.same(config._root._children[0].attrib, {email: 'john.doe@testers.com'});
});

test('add tag with email and href attribute', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.setAuthor('John Doe', 'john.doe@testers.com', 'http://john.doe.com');

	t.is(config._root._children.length, 1);
	t.is(config._root._children[0].tag, 'author');
	t.is(config._root._children[0].text, 'John Doe');
	t.same(config._root._children[0].attrib, {email: 'john.doe@testers.com', href: 'http://john.doe.com'});
});

test('overwrite tag', t => {
	const config = new Config('fixtures/config.xml');
	config.setAuthor('John Doe');

	const element = config._doc.find('./author');

	t.is(element.tag, 'author');
	t.is(element.text, 'John Doe');
	t.same(element.attrib, {});
});

test('overwrite tag and remove other attributes', t => {
	const config = new Config('fixtures/config.xml');
	config.setAuthor('John Doe', 'john.doe@testers.com');

	const element = config._doc.find('./author');

	t.is(element.tag, 'author');
	t.is(element.text, 'John Doe');
	t.same(element.attrib, {email: 'john.doe@testers.com'});
});
