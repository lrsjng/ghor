module.exports = (definitions, inspector) => {
    const isFn = x => typeof x === 'function';
    const isObj = x => typeof x === 'object';
    const err = msg => {throw new Error(msg);};

    if (!isFn(Proxy)) {
        err('ghor-no-proxy');
    }

    if (!isObj(definitions)) {
        err('ghor-no-defs');
    }

    if (!isFn(inspector)) {
        inspector = () => null;
    }

    const defs = Object.assign({}, definitions);
    const insts = {};
    const stack = [];

    const createProxy = fn => new Proxy({}, {get: (target, prop) => fn(prop)});

    const resolve = id => {
        if (id === '_resolve') {
            return resolve;
        }

        if (stack.indexOf(id) >= 0) {
            stack.push(id);
            err('ghor-cycle: ' + stack.join(' > '));
        }

        stack.push(id);
        inspector('req', id, [...stack]);

        if (!insts.hasOwnProperty(id)) {
            if (!defs.hasOwnProperty(id)) {
                err('ghor-no-def: ' + String(id));
            }

            inspector('ini', id);
            const def = defs[id];
            insts[id] = isFn(def) ? def(createProxy(resolve)) : def;
        }

        stack.pop();
        inspector('res', id);
        return insts[id];
    };

    return resolve;
};
