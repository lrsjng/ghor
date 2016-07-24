const {test, assert} = require('scar');

test('Proxy is global', () => {
    assert.equal(typeof global.Proxy, 'function');
});

require('./ghor');

test.cli();
