import test from 'ava';
import Config from '../';

test('throw error', t => {
	const config = new Config('fixtures/config.xml');

	t.throws(config.addHook.bind(config, 'after_then', 'scripts/hook.js'), 'Please provide a valid hook target');
	t.throws(config.addHook.bind(config, 'after_compil', 'scripts/hook.js'), 'Please provide a valid hook target');
});

test('add access origin with an option', t => {
	const config = new Config('fixtures/config.empty.xml');
	config.addHook('after_build', 'scripts/hook.js');

	const tag = config._root.find('./hook/[@type="after_build"]');

	t.is(tag.attrib.src, 'scripts/hook.js');
});
