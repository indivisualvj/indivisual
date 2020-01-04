/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Messaging}
     */
    HC.Messaging = class Messaging {

        /**
         *
         * @param program
         */
        constructor(program) {
            this.program = program;
            this.socket = false;
            this.sid = false;
            this.timeouts = {};

            this.init();
        }

        /**
         *
         * @returns {boolean}
         */
        initSID() {
            this.sid = 'root';

            if (_HASH) {
                this.sid = _HASH;
                return true;

            } else {
                document.location.hash = 'root';
                document.location.reload();
            }

            return false;
        }

        /**
         *
         */
        init() {
            if (this.initSID()) {
                this.program.name += '@' + this.sid;
                G_INSTANCE = this.program.name;
            }
        }

        /**
         *
         */
        initEvents() {
            this.on('log', this.onLog);
            this.on('controls', this.onControls);
            this.on('displays', this.onDisplays);
            this.on('sources', this.onSources);
            this.on('settings', this.onSettings);
            this.on('attr', this.onAttr);
            this.on('midi', this.onMidi);
            this.on('data', this.onData);
        }

        on(event, callback) {
            let that = this;

            this.socket.on(event, function (data) {
                callback(data, that);
            });
        }

        /**
         *
         * @param callback
         */
        connect(callback) {
            HC.log(this.program.name, 'connecting...', true);
            this.socket = io.connect(null, {'secure': true, 'forceNew': true});

            this.initEvents();

            this.socket.once('connect', () => {
                this._join();
                callback(false);

                this.socket.on('connect', () => {
                    this._join();
                    callback(true);
                });
            });
        }

        /**
         *
         * @private
         */
        _join() {
            this._emit({action: 'join', name: this.program.name});
        }

        /**
         *
         * @param data
         * @param that
         */
        onSettings(data, that) {
            requestAnimationFrame(function () {
                that.program.updateSettings(data.layer, data.data, data.controls, data.forward, data.force);
            });
        }

        /**
         *
         * @param data
         * @param that
         */
        onControls(data, that) {
            requestAnimationFrame(function () {
                that.program.updateControls(data.data, data.controls, data.forward, data.force);
            });
        }

        /**
         *
         * @param data
         * @param that
         */
        onDisplays(data, that) {
            requestAnimationFrame(function () {
                that.program.updateDisplays(data.data, data.controls, data.forward, data.force);
            });
        }

        /**
         *
         * @param data
         * @param that
         */
        onSources(data, that) {
            requestAnimationFrame(function () {
                that.program.updateSources(data.data, data.controls, data.forward, data.force);
            });
        }

        /**
         *
         * @param data
         */
        onAttr(data) {
            let key = data.query.replace(/[^a-z0-9]+/gi, '') + data.key;

            requestAnimationFrame(() => {

                let elem = document.querySelector(data.query);
                if (elem) {
                    if (data.value == '') {
                        elem.removeAttribute(data.key);

                    } else {

                        elem.setAttribute(data.key, data.value);
                    }

                    if (data.resetValue != undefined) {

                        if (this.timeouts[key]) {
                            clearTimeout(this.timeouts[key]);
                        }

                        this.timeouts[key] = setTimeout(() => {

                            if (data.resetValue == '') {
                                elem.removeAttribute(data.key);

                            } else {
                                elem.setAttribute(data.key, data.resetValue);
                            }
                            delete this.timeouts[key];
                        }, data.timeout ? data.timeout : 125);
                    }
                }
            });
        }

        /**
         *
         * @param data
         * @param that
         */
        onMidi(data, that) {
            that.program.updateMidi(data);
        }

        /**
         *
         * @param data
         */
        onData(data, that) {
            requestAnimationFrame(function () {
                that.program.updateData(data);
            });
        }

        /**
         *
         * @param data
         */
        onLog(data) {

            HC.log(data.key, data.value);
        }

        /**
         *
         * @param key
         * @param value
         */
        emitLog(key, value) {
            let config = {
                action: 'log',
                key: key,
                value: value
            };
            this._emit(config);
        }

        /**
         *
         * @param query
         * @param key
         * @param value
         * @param resetValue
         */
        emitAttr(query, key, value, resetValue) {
            let config = {
                action: 'attr',
                query: query,
                key: key,
                value: value,
                resetValue: resetValue
            };
            this._emit(config);
        }

        /**
         *
         * @param command
         * @param target
         * @param conf
         */
        emitMidi(command, target, conf) {
            let config = {
                action: 'midi',
                command: command,
                data: target,
                conf: conf
            };
            this._emit(config);
        }

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        emitControls(data, display, forward, force) {
            if (data) {
                if (data instanceof HC.Settings) {
                    data = data.prepare();
                }

                statics.ControlSettings.clean(data, statics.ControlSettings.initial);

                let config = {
                    action: 'controls',
                    data: data,
                    controls: display,
                    forward: forward,
                    force: force
                };

                this._emit(config);
            }
        }

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        emitDisplays(data, display, forward, force) {
            if (data) {
                if (data instanceof HC.Settings) {
                    data = data.prepare();
                }

                statics.DisplaySettings.clean(data, statics.DisplaySettings.initial);

                let config = {
                    action: 'displays',
                    data: data,
                    controls: display,
                    forward: forward,
                    force: force
                };

                this._emit(config);
            }
        }

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        emitSources(data, display, forward, force) {
            if (data) {
                if (data instanceof HC.Settings) {
                    data = data.prepare();
                }

                statics.SourceSettings.clean(data, statics.SourceSettings.initial);

                let config = {
                    action: 'sources',
                    data: data,
                    controls: display,
                    forward: forward,
                    force: force
                };

                this._emit(config);
            }
        }

        /**
         *
         * @param layer
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        emitSettings(layer, data, display, forward, force) {
            let config = {
                action: 'settings',
                data: data,
                controls: display,
                forward: forward,
                force: force,
                layer: layer
            };

            this._emit(config);
        }

        /**
         *
         * @param keys
         * @param data
         */
        emitData(key, data) {
            let config = {
                action: 'data',
                from: this.program.name,
                key: key,
                data: data
            };
            this._emit(config);
        }

        /**
         * @param data
         * @param callback
         */
        _emit(data, callback) {

            data.sid = this.sid;
            data.from = this.program.name;
            this.socket.emit(data.action, data, callback);
        }

        /**
         *
         * @param callback
         */
        sync(callback) {

            HC.log(this.program.name, 'syncing...', true);

            let data = {
                sid: this.sid,
                action: 'sync',
                from: this.program.name,
                force: true,
                controls: true,
                forward: false
            };
            this._emit(data, callback);
        }

        /**
         *
         * @param dir
         * @param file
         * @param callback
         */
        load(base, dir, file, callback) {
            let path = filePath(base, dir);
            let data = {
                action: 'get',
                dir: dir,
                name: file,
                file: path + '/' + file
            };
            this._emit(data, callback);
        }

        /**
         *
         * @param dir
         * @param file
         * @param data
         * @param callback
         */
        save(base, dir, file, data, callback) {
            let path = filePath(base, dir);
            let conf = {
                action: 'save',
                dir: path,
                file: file,
                contents: JSON.stringify(data, null, 4)
            };

            this._emit(conf, callback);
        }

        /**
         *
         * @param base
         * @param dir
         * @param data
         * @param callback
         */
        mkdir(base, dir, data, callback) {
            let path = filePath(base, dir);
            let conf = {
                action: 'mkdir',
                dir: path,
                contents: JSON.stringify(data)
            };

            this._emit(conf, callback);
        }

        /**
         *
         * @param dir
         * @param callback
         */
        files(dir, callback) {
            let conf = {
                action: 'files',
                file: dir
            };

            this._emit(conf, callback);
        }

        /**
         *
         * @param dir
         * @param file
         * @param data
         */
        sample(dir, file, data) {
            let path = filePath(SAMPLE_DIR, dir);
            let conf = {
                action: 'sample',
                dir: path,
                file: file,
                contents: data
            };

            this._emit(conf);
        }

        /**
         *
         * @param dir
         * @param file
         * @param callback
         */
        delete(base, dir, file, callback) {
            let path = filePath(base, dir);
            let data = {
                action: 'delete',
                dir: path,
                file: file
            };

            this._emit(data, callback);
        }

        /**
         *
         * @param dir
         * @param file
         * @param callback
         */
        rename(base, dir, file, nu, callback) {
            let path = filePath(base, dir);
            let data = {
                action: 'rename',
                dir: path,
                file: file,
                nu: nu
            };

            this._emit(data, callback);
        }
    }
}