/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.ScriptProcessor = class ScriptProcessor {
        constructor(key, desc) {
            this.key = key;
            this.desc = desc;
            this.load();
        }

        load() {
            for (var i in this.desc) {
                var d = this.desc[i];

                if (d.exec) {
                    var calls = [];
                    for (var e in d.exec) {
                        var ex = d.exec[e];

                        ex = ex.split(',');

                        var instance = ex.shift();
                        var func = ex.shift();
                        var args = parseArray(ex);

                        instance = this._getInstance(instance);

                        calls.push({instance: instance, func: func, args: args});
                    }
                    d.calls = calls;

                    var inst = this;
                    var _create = function (d) {
                        return function () {
                            for (var i in d.calls) {
                                var c = d.calls[i];
                                inst._call(c.instance, c.func, c.args);
                            }
                        };
                    };

                    d.action = _create(d);
                }
            }
        }

        _getInstance(instance) {
            switch (instance) {
                default:
                case 'controller':
                    return controller;
            }
        }

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

        log() {

            HC.clearLog();
            HC.log(HC.logGetRed('tutorial'), this.key);

            for (var i in this.desc) {
                var d = this.desc[i];

                HC.log(HC.logGetRed(i), HC.logGetYellow(d.text));

                if (d.action) {
                    HC.logFunction('>>let\'s do it!<<', d.action);
                }
            }
        }

        execute() {
            for (var i in this.desc) {
                var d = this.desc[i];
                if (d.action) {
                    d.action();
                }
            }
        }
    }
}