import test from 'ava';
import Config from '../';

test('add tag', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.setElement('earth');

	t.is(config._root._children.length, 1);
	t.is(config._root._children[0].tag, 'earth');
});

test('add tag with text', t => {
	const config = new Config('fixtures/config.xml');
	config.setElement('earth', 'heavy matter');

	const element = config._doc.find('./earth');

	t.is(element.tag, 'earth');
	t.is(element.text, 'heavy matter');
});

test('add tag with attributes', t => {
	const config = new Config('fixtures/config.xml');
	config.setElement('earth', {size: 149000000});

	const element = config._doc.find('./earth');

	t.is(element.tag, 'earth');
	t.is(element.attrib.size, 149000000);
});

test('add tag with text and attributes', t => {
	const config = new Config('fixtures/config.xml');
	config.setElement('earth', 'heavy matter', {size: 149000000});

	const element = config._doc.find('./earth');

	t.is(element.tag, 'earth');
	t.is(element.text, 'heavy matter');
	t.is(element.attrib.size, 149000000);
});

test('update text', t => {
	const config = new Config('fixtures/config.xml');
	config.setElement('author', 'Foo Bar');

	const element = config._doc.find('./author');

	t.is(element.tag, 'author');
	t.is(element.text, 'Foo Bar');
	t.same(element.attrib, {});
});

test('update attributes', t => {
	const config = new Config('fixtures/config.xml');
	config.setElement('author', {email: 'foo@bar.com'});

	const element = config._doc.find('./author');

	t.is(element.tag, 'author');
	t.is(element.text, '');
	t.same(element.attrib, {email: 'foo@bar.com'});
});

test('update text and attributes', t => {
	const config = new Config('fixtures/config.xml');
	config.setElement('author', 'Foo Bar', {email: 'foo@bar.com'});

	const element = config._doc.find('./author');

	t.is(element.tag, 'author');
	t.is(element.text, 'Foo Bar');
	t.same(element.attrib, {email: 'foo@bar.com'});
});
