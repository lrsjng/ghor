module.exports = (defs, insp) => {
    if (typeof Proxy !== 'function') {
        throw new Error('ghor-no-proxy');
    }

    if (typeof defs !== 'object') {
        throw new Error('ghor-no-defs');
    }

    if (typeof insp !== 'function') {
        insp = () => null;
    }

    const insts = {};
    const stack = [];

    let proxy; // eslint-disable-line prefer-const

    const lookup = id => {
        if (id === '_resolve') {
            return lookup;
        }

        if (stack.indexOf(id) >= 0) {
            stack.push(id);
            throw new Error('ghor-cycle: ' + stack.join(' > '));
        }

        stack.push(id);
        insp('req', id, [...stack]);

        if (!insts.hasOwnProperty(id)) {
            if (!defs.hasOwnProperty(id)) {
                throw new Error('ghor-no-def: ' + String(id));
            }

            insp('ini', id);
            const def = defs[id];
            insts[id] = typeof def === 'function' ? def(proxy) : def;
        }

        stack.pop();
        insp('res', id);
        return insts[id];
    };

    proxy = new Proxy({}, { // eslint-disable-line prefer-const
        get: (target, prop) => lookup(prop)
    });

    return lookup;
};
