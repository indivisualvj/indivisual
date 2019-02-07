/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {
    /**
     *
     * @param program
     * @constructor
     */
    HC.Messaging = function (program) {
        this.program = program;
        this.socket = false;
        this.sid = false;
        this.timeouts = {};

        this.init();
    };

    HC.Messaging.prototype = {

        /**
         *
         * @returns {boolean}
         */
        initSID: function () {
            this.sid = 'root';

            if (_HASH) {
                this.sid = _HASH;
                return true;

            } else {
                document.location.hash = 'root';
                document.location.reload();
            }

            return false;
        },

        /**
         *
         */
        init: function() {
            if (this.initSID()) {
                this.program.name += '@' + this.sid;
                G_INSTANCE = this.program.name;
            }
        },

        /**
         *
         */
        initEvents: function () {
            this.on('log', this.onLog);
            this.on('controls', this.onControls);
            this.on('displays', this.onDisplays);
            this.on('sources', this.onSources);
            this.on('settings', this.onSettings);
            this.on('attr', this.onAttr);
            this.on('midi', this.onMidi);
            this.on('data', this.onData);
        },

        on: function (event, callback) {
            var that = this;

            this.socket.on(event, function (data) {
                callback(data, that);
            });
        },

        /**
         *
         * @param callback
         */
        connect: function (callback) {
            _log(this.program.name, 'connecting...', true);
            this.socket = io.connect(null, {'secure': true, 'forceNew':true});

            this.initEvents();

            var inst = this;
            this.socket.once('connect', function () {
                inst._join();
                callback(false);

                inst.socket.on('connect', function () {
                    inst._join();
                    callback(true);
                });
            });
        },

        /**
         *
         * @private
         */
        _join: function () {
            this._emit({action: 'join', name: this.program.name});
        },

        /**
         *
         * @param data
         * @param that
         */
        onSettings: function (data, that) {
            requestAnimationFrame(function () {
                that.program.updateSettings(data.layer, data.data, data.controls, data.forward, data.force);
            });
        },

        /**
         *
         * @param data
         * @param that
         */
        onControls: function (data, that) {
            requestAnimationFrame(function () {
                that.program.updateControls(data.data, data.controls, data.forward, data.force);
            });
        },

        /**
         *
         * @param data
         * @param that
         */
        onDisplays: function (data, that) {
            requestAnimationFrame(function () {
                that.program.updateDisplays(data.data, data.controls, data.forward, data.force);
            });
        },

        /**
         *
         * @param data
         * @param that
         */
        onSources: function (data, that) {
            requestAnimationFrame(function () {
                that.program.updateSources(data.data, data.controls, data.forward, data.force);
            });
        },

        /**
         *
         * @param data
         */
        onAttr: function (data) {
            var inst = this;
            var key = data.query.replace(/[^a-z0-9]+/gi, '') + data.key;

            requestAnimationFrame(function () {

                var elem = document.querySelector(data.query);
                if (elem) {
                    if (data.value == '') {
                        elem.removeAttribute(data.key);

                    } else {

                        elem.setAttribute(data.key, data.value);
                    }

                    if (data.resetValue != undefined) {

                        if (inst.timeouts[key]) {
                            clearTimeout(inst.timeouts[key]);
                        }

                        inst.timeouts[key] = setTimeout(function () {

                            if (data.resetValue == '') {
                                elem.removeAttribute(data.key);

                            } else {
                                elem.setAttribute(data.key, data.resetValue);
                            }
                            delete inst.timeouts[key];
                        }, data.timeout ? data.timeout : 125);
                    }
                }
            });
        },

        /**
         *
         * @param data
         */
        onMidi: function (data) {
            if (midi) {
                if (data.command == 'glow') {
                    midi.glow(data.data, data.conf);

                } else if (data.command == 'off') {
                    midi.off(data.data);

                } else if (data.command == 'clock') {
                    midi.clock(data.data, data.conf);
                }
            }
        },

        /**
         *
         * @param data
         */
        onData: function (data, that) {
            requestAnimationFrame(function () {
                that.program.updateData(data);
            });
        },

        /**
         *
         * @param data
         */
        onLog: function (data) {

            _log(data.key, data.value);
        },

        /**
         *
         * @param key
         * @param value
         */
        emitLog: function (key, value) {
            var config = {
                action: 'log',
                key: key,
                value: value
            };
            this._emit(config);
        },

        /**
         *
         * @param query
         * @param key
         * @param value
         * @param resetValue
         */
        emitAttr: function (query, key, value, resetValue) {
            var config = {
                action: 'attr',
                query: query,
                key: key,
                value: value,
                resetValue: resetValue
            };
            this._emit(config);
        },

        /**
         *
         * @param command
         * @param target
         * @param conf
         */
        emitMidi: function (command, target, conf) {
            var config = {
                action: 'midi',
                command: command,
                data: target,
                conf: conf
            };
            this._emit(config);
        },

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        emitControls: function (data, display, forward, force) {
            if (data) {
                if (data instanceof HC.Settings) {
                    data = data.prepare();
                }

                statics.ControlSettings.clean(data, statics.ControlSettings.initial);
                
                var config = {
                    action: 'controls',
                    data: data,
                    controls: display,
                    forward: forward,
                    force: force
                };

                this._emit(config);
            }
        },

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        emitDisplays: function (data, display, forward, force) {
            if (data) {
                if (data instanceof HC.Settings) {
                    data = data.prepare();
                }

                statics.DisplaySettings.clean(data, statics.DisplaySettings.initial);

                var config = {
                    action: 'displays',
                    data: data,
                    controls: display,
                    forward: forward,
                    force: force
                };

                this._emit(config);
            }
        },

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        emitSources: function (data, display, forward, force) {
            if (data) {
                if (data instanceof HC.Settings) {
                    data = data.prepare();
                }

                statics.SourceSettings.clean(data, statics.SourceSettings.initial);

                var config = {
                    action: 'sources',
                    data: data,
                    controls: display,
                    forward: forward,
                    force: force
                };

                this._emit(config);
            }
        },

        /**
         *
         * @param layer
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        emitSettings: function (layer, data, display, forward, force) {
            if (data) {
                if (data instanceof HC.Settings) {
                    data = data.prepare();
                }
                
                statics.AnimationSettings.clean(data, statics.AnimationSettings.initial);
                
                var config = {
                    action: 'settings',
                    data: data,
                    controls: display,
                    forward: forward,
                    force: force,
                    layer: layer
                };

                this._emit(config);
            }
        },

        /**
         *
         * @param keys
         * @param data
         */
        emitData: function (key, data) {
            var config = {
                action: 'data',
                from: this.program.name,
                key: key,
                data: data
            };
            this._emit(config);
        },

        /**
         * @param data
         * @param callback
         */
        _emit: function (data, callback) {

            data.sid = this.sid;
            data.from = this.program.name;
            this.socket.emit(data.action, data, callback);
        },

        /**
         *
         * @param callback
         */
        sync: function (callback) {

            _log(this.program.name, 'syncing...', true);

            var data = {
                sid: this.sid,
                action: 'sync',
                from: this.program.name,
                force: true,
                controls: true,
                forward: false
            };
            this._emit(data, callback);
        },

        /**
         *
         * @param dir
         * @param file
         * @param callback
         */
        load: function (base, dir, file, callback) {
            var path = filePath(base, dir);
            var data = {
                action: 'get',
                dir: dir,
                name: file,
                file: path + '/' + file
            };
            this._emit(data, callback);
        },

        /**
         *
         * @param dir
         * @param file
         * @param data
         * @param callback
         */
        save: function (base, dir, file, data, callback) {
            var path = filePath(base, dir);
            var conf = {
                action: 'save',
                dir: path,
                file: file,
                contents: JSON.stringify(data)
            };

            this._emit(conf, callback);
        },

        /**
         *
         * @param base
         * @param dir
         * @param data
         * @param callback
         */
        mkdir: function (base, dir, data, callback) {
            var path = filePath(base, dir);
            var conf = {
                action: 'mkdir',
                dir: path,
                contents: JSON.stringify(data)
            };

            this._emit(conf, callback);
        },

        /**
         *
         * @param dir
         * @param callback
         */
        files: function (dir, callback) {
            var conf = {
                action: 'files',
                file: dir
            };

            this._emit(conf, callback);
        },

        /**
         *
         * @param dir
         * @param file
         * @param data
         */
        sample: function (dir, file, data) {
            var path = filePath(SAMPLE_DIR, dir);
            var conf = {
                action: 'sample',
                dir: path,
                file: file,
                contents: data
            };

            this._emit(conf);
        },

        /**
         *
         * @param dir
         * @param file
         * @param callback
         */
        'delete': function (base, dir, file, callback) {
            var path = filePath(base, dir);
            var data = {
                action: 'delete',
                dir: path,
                file: file,
                contents: JSON.stringify(data)
            };

            this._emit(data, callback);
        },

        /**
         *
         * @param dir
         * @param file
         * @param callback
         */
        'rename': function (base, dir, file, nu, callback) {
            var path = filePath(base, dir);
            var data = {
                action: 'rename',
                dir: path,
                file: file,
                nu: nu,
                contents: JSON.stringify(data)
            };

            this._emit(data, callback);
        }
    }
})();