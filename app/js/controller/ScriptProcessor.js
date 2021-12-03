/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class ScriptProcessor {

    /**
     * @type {Controller}
     */
    instance;

    /**
     *
     * @param {Controller} instance
     * @param key
     * @param desc
     */
    constructor(instance, key, desc) {
        this.instance = instance;
        this.key = key;
        this.desc = desc;
        this.load();
    }

    /**
     *
     */
    load() {
        for (let i in this.desc) {
            let d = this.desc[i];

            if (d.exec) {
                let calls = [];
                for (let e in d.exec) {
                    let ex = d.exec[e];

                    ex = ex.split(',');

                    let instance = ex.shift();
                    let func = ex.shift();
                    let args = HC.parseArray(ex);

                    instance = this._getInstance(instance);

                    calls.push({instance: instance, func: func, args: args});
                }
                d.calls = calls;

                let inst = this;
                let _create = function (d) {
                    return function () {
                        for (let i in d.calls) {
                            let c = d.calls[i];
                            inst._call(c.instance, c.func, c.args);
                        }
                    };
                };

                d.action = _create(d);
            }
        }
    }

    /**
     *
     * @param instance
     * @returns {null|Controller}
     * @private
     */
    _getInstance(instance) {
        switch (instance) {
            case 'messaging':
                return messaging;
        }

        return this.instance;
    }

    /**
     *
     * @param instance
     * @param func
     * @param args
     * @private
     */
    _call(instance, func, args) {

        if (args && args.length) {

            if (args.length > 5) {
                instance[func](args[0], args[1], args[2], args[3], args[4], args[5]);

            } else if (args.length > 4) {
                instance[func](args[0], args[1], args[2], args[3], args[4]);

            } else if (args.length > 3) {
                instance[func](args[0], args[1], args[2], args[3]);

            } else if (args.length > 2) {
                instance[func](args[0], args[1], args[2]);

            } else if (args.length > 1) {
                instance[func](args[0], args[1]);

            } else {
                instance[func](args[0]);
            }

        } else {
            instance[func]();
        }
    }

    /**
     *
     */
    log() {

        HC.clearLog();
        HC.log(HC.logGetRed('tutorial'), this.key);

        for (let i in this.desc) {
            let d = this.desc[i];

            HC.log(HC.logGetRed(i), HC.logGetYellow(d.text));

            if (d.action) {
                HC.logFunction('>>let\'s do it!<<', d.action);
            }
        }
    }

    /**
     *
     */
    execute() {
        for (let i in this.desc) {
            let d = this.desc[i];
            if (d.action) {
                d.action();
            }
        }
    }
}

export {ScriptProcessor}