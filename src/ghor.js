const is_fn = x => typeof x === 'function';
const is_obj = x => x && typeof x === 'object';
const asrt = (expr, msg) => {
    if (!expr) {
        throw new Error(msg);
    }
};

module.exports = (definitions, inspector) => {
    asrt(is_fn(Proxy), 'ghor-no-proxy');
    asrt(is_obj(definitions), 'ghor-no-defs');

    if (!is_fn(inspector)) {
        inspector = () => null;
    }

    const defs = Object.assign({}, definitions);
    const insts = {};

    const resolver = fn => new Proxy({}, {get: (target, prop) => fn(prop)});

    const resolve = (id, stack = []) => {
        if (id === '_resolve') {
            return resolve;
        }

        asrt(!stack.includes(id), 'ghor-cycle: ' + [...stack, id].join(' > '));

        stack = [...stack, id];
        inspector('req', id, stack);

        if (!insts.hasOwnProperty(id)) {
            asrt(defs.hasOwnProperty(id), 'ghor-no-def: ' + String(id));

            inspector('ini', id);
            const def = defs[id];
            insts[id] = is_fn(def) ? def(resolver(i => resolve(i, stack))) : def;
        }

        inspector('res', id);
        return insts[id];
    };

    return resolve;
};
