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

                        var instance = ex.instance;
                        var func = ex.func;
                        var args = ex.args;

                        if (instance) {
                            func = window[instance][func];
                        }

                        calls.push(this._generateCall(func, args));
                    }

                    var action = function () {
                        for (var i in calls) {
                            calls[i]();
                        }
                    };
                    d.action = action;
                }
            }
        }

        _generateCall(func, args) {
            return function () {
                if (args.length > 4) {
                    func(args[0], args[1], args[2], args[3], args[3]);
                } else if (args.length > 3) {
                    func(args[0], args[1], args[2], args[3]);
                } else if (args.length > 2) {
                    func(args[0], args[1], args[2]);
                } else if (args.length > 1) {
                    func(args[0], args[1]);
                } else if (args.length > 0) {
                    func(args[0]);
                } else {
                    func();
                }
            }
        }

        log() {
            for (var i in desc) {
                var d = desc[i];
                var span = '<span class="yellow">' + d.text + '</span>';
                HC.log(key + ' (' + i + ')', span, false, false, true);

                if (d.action) {
                    HC.logAction('let\'s try!', d.action);
                }
            }
        }

        execute() {
            for (var i in desc) {
                var d = desc[i];
                if (d.action) {
                    d.action();
                }
            }
        }
    }
}