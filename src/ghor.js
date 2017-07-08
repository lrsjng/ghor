const is_fn = x => typeof x === 'function';
const is_obj = x => x && typeof x === 'object';
const err = msg => {throw new Error(msg);};

module.exports = (definitions, inspector) => {
    if (!is_fn(Proxy)) {
        err('ghor-no-proxy');
    }

    if (!is_obj(definitions)) {
        err('ghor-no-defs');
    }

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

        if (stack.indexOf(id) >= 0) {
            err('ghor-cycle: ' + [...stack, id].join(' > '));
        }

        stack = [...stack, id];
        inspector('req', id, stack);

        if (!insts.hasOwnProperty(id)) {
            if (!defs.hasOwnProperty(id)) {
                err('ghor-no-def: ' + String(id));
            }

            inspector('ini', id);
            const def = defs[id];
            insts[id] = is_fn(def) ? def(resolver(i => resolve(i, stack))) : def;
        }

        inspector('res', id);
        return insts[id];
    };

    return resolve;
};
