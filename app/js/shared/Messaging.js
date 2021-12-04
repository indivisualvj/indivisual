/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {TimeoutManager} from "../manager/TimeoutManager";
import {Logger} from "./Logger";

class Messaging {
    static program;
    static socket;
    static sid;

    /**
     *
     * @param program
     */
    static init(program) {
        Messaging.program = program;
        this.socket = false;
        this.sid = false;

        this._init();
    }

    /**
     *
     * @returns {boolean}
     */
    static initSID() {
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
    static _init() {
        if (this.initSID()) {
            Messaging.program.name += '@' + this.sid;
            G_INSTANCE = Messaging.program.name;
        }
    }

    /**
     *
     */
    static initEvents() {
        this.on('log', this.onLog);
        this.on('controls', this.onControls);
        this.on('displays', this.onDisplays);
        this.on('sources', this.onSources);
        this.on('settings', this.onSettings);
        this.on('attr', this.onAttr);
        this.on('midi', this.onMidi);
        this.on('data', this.onData);
    }

    static on(event, callback) {
        this.socket.on(event, (data) => {
            callback(data, this);
        });
    }

    /**
     *
     * @param callback
     */
    static connect(callback) {
        Logger.log(Messaging.program.name, 'connecting...', true);
        this.socket = io.connect(null, {'secure': true, 'forceNew': true});

        this.initEvents();

        this.socket.once('connect', () => {
            this._join();
            callback(false, Messaging.program);

            this.socket.on('connect', () => {
                this._join();
                callback(true, Messaging.program);
            });
        });
    }

    /**
     *
     * @private
     */
    static _join() {
        this._emit({action: 'join', name: Messaging.program.name});
    }

    /**
     *
     * @param data
     * @param that
     */
    static onSettings(data, that) {
        if (that.program.ready) {
            requestAnimationFrame(function () {
                that.program.updateSettings(data.layer, data.data, data.controls, data.forward, data.force);
            });
        }
    }

    /**
     *
     * @param data
     * @param that
     */
    static onControls(data, that) {
        if (that.program.ready) {
            requestAnimationFrame(function () {
                that.program.updateControls(data.data, data.controls, data.forward, data.force);
            });
        }
    }

    /**
     *
     * @param data
     * @param that
     */
    static onDisplays(data, that) {
        if (that.program.ready) {
            requestAnimationFrame(function () {
                that.program.updateDisplays(data.data, data.controls, data.forward, data.force);
            });
        }
    }

    /**
     *
     * @param data
     * @param that
     */
    static onSources(data, that) {
        if (that.program.ready) {
            requestAnimationFrame(function () {
                that.program.updateSources(data.data, data.controls, data.forward, data.force);
            });
        }
    }

    /**
     *
     * @param data
     * @param that
     */
    static onAttr(data, that) {
        let key = data.query.replace(/[^a-z0-9]+/gi, '') + data.key;

        requestAnimationFrame(() => {

            let elem = document.querySelector(data.query);
            if (elem) {
                if (data.value === '') {
                    if (data.timeout && TimeoutManager.has(key)) {
                        return;
                    }
                    elem.removeAttribute(data.key);

                } else {
                    elem.setAttribute(data.key, data.value);
                }

                if (data.resetValue !== undefined) {
                    TimeoutManager.add(key, data.timeout ? data.timeout : 125, () => {
                        if (data.resetValue === '') {
                            elem.removeAttribute(data.key);

                        } else {
                            elem.setAttribute(data.key, data.resetValue);
                        }
                    });
                }
            }
        });
    }

    /**
     *
     * @param data
     * @param that
     */
    static onMidi(data, that) {
        that.program.updateMidi(data);
    }

    /**
     *
     * @param data
     * @param that
     */
    static onData(data, that) {
        requestAnimationFrame(function () {
            that.program.updateData(data);
        });
    }

    /**
     *
     * @param data
     */
    static onLog(data) {

        Logger.log(data.key, data.value);
    }

    /**
     *
     * @param key
     * @param value
     */
    static emitLog(key, value) {
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
     * @param timeout
     */
    static emitAttr(query, key, value, resetValue, timeout) {
        let config = {
            action: 'attr',
            query: query,
            key: key,
            value: value,
            resetValue: resetValue
        };

        if (timeout) {
            config.timeout = timeout;
        }

        this._emit(config);
    }

    /**
     *
     * @param command
     * @param target
     * @param conf
     */
    static emitMidi(command, target, conf) {
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
    static emitControls(data, display, forward, force) {
        if (data) {

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
    static emitDisplays(data, display, forward, force) {
        if (data) {

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
     * @param callback
     */
    static emitSources(data, display, forward, force, callback) {
        if (data) {
            let config = {
                action: 'sources',
                data: data,
                controls: display,
                forward: forward,
                force: force
            };

            this._emit(config, callback);
        }
    }

    /**
     *
     * @param layer
     * @param data
     * @param display
     * @param forward
     * @param force
     * @param callback
     */
    static emitSettings(layer, data, display, forward, force, callback) {
        let config = {
            action: 'settings',
            data: data,
            controls: display,
            forward: forward,
            force: force,
            layer: layer
        };

        this._emit(config, callback);
    }

    /**
     *
     * @param key
     * @param data
     */
    static emitData(key, data) {
        let config = {
            action: 'data',
            from: Messaging.program.name,
            key: key,
            data: data
        };
        this._emit(config);
    }

    /**
     * @param data
     * @param callback
     */
    static _emit(data, callback) {

        data.sid = this.sid;
        data.from = Messaging.program.name;
        this.socket.emit(data.action, data, callback);
    }

    /**
     *
     * @param callback
     */
    static sync(callback) {

        Messaging.program.ready = true;

        Logger.log(Messaging.program.name, 'syncing...', true);

        let data = {
            sid: this.sid,
            action: 'sync',
            from: Messaging.program.name,
            force: true,
            controls: true,
            forward: false
        };
        this._emit(data, callback);
    }

    /**
     *
     * @param base
     * @param dir
     * @param file
     * @param callback
     */
    static load(base, dir, file, callback) {
        let path = HC.filePath(base, dir);
        let data = {
            action: 'load',
            dir: dir,
            name: file,
            file: path + '/' + file
        };
        this._emit(data, callback);
    }


    /**
     *
     * @param base
     * @param dir
     * @param file
     * @param callback
     */
    static config(base, dir, file, callback) {
        let path = HC.filePath(base, dir);
        let data = {
            action: 'config',
            dir: dir,
            name: file,
            file: path + '/' + file
        };
        this._emit(data, callback);
    }

    /**
     *
     * @param base
     * @param dir
     * @param file
     * @param data
     * @param callback
     */
    static save(base, dir, file, data, callback) {
        let path = HC.filePath(base, dir);
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
    static mkdir(base, dir, data, callback) {
        let path = HC.filePath(base, dir);
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
    static files(dir, callback) {
        let conf = {
            action: 'files',
            file: dir
        };

        this._emit(conf, callback);
    }


    /**
     *
     * @param dir
     * @param callback
     */
    static samples(dir, callback) {
        let conf = {
            action: 'samples',
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
    static sample(dir, file, data) {
        let path = HC.filePath(SAMPLE_DIR, dir);
        let conf = {
            action: 'write',
            dir: path,
            file: file,
            contents: data
        };

        this._emit(conf);
    }

    /**
     *
     * @param base
     * @param dir
     * @param file
     * @param callback
     */
    static delete(base, dir, file, callback) {
        let path = HC.filePath(base, dir);
        let data = {
            action: 'delete',
            dir: path,
            file: file
        };

        this._emit(data, callback);
    }

    /**
     *
     * @param base
     * @param dir
     * @param file
     * @param nu
     * @param callback
     */
    static rename(base, dir, file, nu, callback) {
        let path = HC.filePath(base, dir);
        let data = {
            action: 'rename',
            dir: path,
            file: file,
            nu: nu
        };

        this._emit(data, callback);
    }
}

export {Messaging}
