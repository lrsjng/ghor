const {test, assert, spy} = require('scar');
const ghor = require('../src/ghor');

test('ghor is function', () => {
    assert.equal(typeof ghor, 'function');
});

test('ghor throws with no args', () => {
    assert.throws(() => {
        ghor();
    }, /ghor-no-defs/);
});

test('ghor throws with wrong type first arg', () => {
    assert.throws(() => {
        ghor(1);
    }, /ghor-no-defs/);
});

test('ghor returns function', () => {
    assert.equal(typeof ghor({}), 'function');
});

test('ghor throws for unknown id', () => {
    assert.throws(() => {
        ghor({})('a');
    }, /ghor-no-def: a/);
});

test('ghor throws when no Proxy', () => {
    const bak = global.Proxy;
    global.Proxy = null;
    try {
        ghor({});
        global.Proxy = bak;
        throw new Error('no error thrown');
    } catch (err) {
        global.Proxy = bak;
        assert.equal(err.message, 'ghor-no-proxy');
    }
});

test('ghor resolves object definitions', () => {
    const obj = {};
    const defs = {
        a: obj
    };
    const g = ghor(defs);
    assert.equal(g('a'), obj);
});

test('ghor resolves function definitions', () => {
    const obj = {};
    const defs = {
        a: () => obj
    };
    const g = ghor(defs);
    assert.equal(g('a'), obj);
});

test('ghor resolves transitive', () => {
    const obj = {};
    const defs = {
        a: ({b} = {}) => b,
        b: obj
    };
    const g = ghor(defs);
    assert.equal(g('a'), obj);
});

test('ghor throws for circular deps', () => {
    const defs = {
        /* eslint-disable no-unused-vars */
        a: ({b} = {}) => null,
        b: ({a} = {}) => null
        /* eslint-enable */
    };
    const g = ghor(defs);
    assert.throws(() => {
        g('a');
    }, /ghor-cycle: a > b > a/);
});

test('ghor throws for long circular deps', () => {
    const defs = {
        /* eslint-disable no-unused-vars */
        a: ({b} = {}) => null,
        b: ({c} = {}) => null,
        c: ({d} = {}) => null,
        d: ({e} = {}) => null,
        e: ({f} = {}) => null,
        f: ({a} = {}) => null
        /* eslint-enable */
    };
    const g = ghor(defs);
    assert.throws(() => {
        g('a');
    }, /ghor-cycle: a > b > c > d > e > f > a/);
});

test('ghor injects _resolve', () => {
    const defs = {
        a: ({_resolve} = {}) => _resolve
    };
    const g = ghor(defs);
    assert.equal(g('a'), g);
});

test('ghor runs function defs only once', () => {
    const obj = {};
    const fn = spy(obj);
    const defs = {a: fn};
    const g = ghor(defs);
    assert.equal(fn.calls.length, 0);
    assert.equal(g('a'), obj);
    assert.equal(fn.calls.length, 1);
    assert.equal(g('a'), obj);
    assert.equal(fn.calls.length, 1);
});

test('ghor insp works', () => {
    const defs = {
        /* eslint-disable no-unused-vars */
        a: ({b, c} = {}) => null,
        b: ({c} = {}) => null,
        c: null
        /* eslint-enable */
    };
    const exp = [
        ['req', 'a', ['a']],
        ['ini', 'a'],
        ['req', 'b', ['a', 'b']],
        ['ini', 'b'],
        ['req', 'c', ['a', 'b', 'c']],
        ['ini', 'c'],
        ['res', 'c'],
        ['res', 'b'],
        ['req', 'c', ['a', 'c']],
        ['res', 'c'],
        ['res', 'a']
    ];
    const fn = spy();
    const g = ghor(defs, fn);
    assert.deepEqual(fn.calls, []);
    g('a');
    assert.deepEqual(fn.calls.map(call => call.args), exp);
});
