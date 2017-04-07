import test from 'ava';
import Config from '../';

test('remove all access origins', t => {
	const config = new Config('fixtures/config.xml');
	config.removeAccessOrigins();

	t.is(config._root.findall('./access').length, 0);
});
