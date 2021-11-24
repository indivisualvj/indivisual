#!/usr/bin/env node
'use strict';

const conf = require('./config.json');
const fs = require('fs');
const {networkInterfaces} = require('os');
const path = require('path');
const express = require('express');
const sio = require('socket.io');
const https = require('https');
const http = require('http');
const _commandLineArgs = require('command-line-args');
const _resolveHome = require('expand-home-dir');


let options = _commandLineArgs([
    {name: "port", alias: "p", type: String, defaultOption: true},
    {name: "https", type: Boolean},
    {name: "ssl-key", type: String},
    {name: "ssl-cert", type: String},
]);


const _ROOT = path.resolve('.');
const _APP = path.resolve(conf.directories.app);
const _BIN = path.resolve(conf.directories.bin);
const _HOME = path.resolve(_resolveHome(conf.directories.home));
const _SESSIONS = conf.directories.sessions; // do not resolve!
const _PORT = options.port ? options.port : conf.port;
const _HTTPS = typeof options.https != "undefined";
const _SSL_KEY = options['ssl-key'] ? options['ssl-key'] : 'ssl/server.key';
const _SSL_CERT = options['ssl-cert'] ? options['ssl-cert'] : 'ssl/server.crt';

let app = express();
let server = null;
if (_HTTPS) {
    let credentials = {
        key: fs.readFileSync(_SSL_KEY),
        cert: fs.readFileSync(_SSL_CERT),
        requestCert: false,
        rejectUnauthorized: false
    };
    console.log('using ssl');
    server = https.createServer(credentials, app);
} else {
    server = http.createServer(app);
}

let io = sio.listen(server);

let sessions = {};
let members = ['animation', 'controller', 'client', 'setup', 'monitor'];

let targetsGroups = {
    animation: ['controls', 'displays', 'sources', 'settings', 'log', 'midi'],
    controller: ['controls', 'displays', 'sources', 'settings', 'log', 'attr', 'midi', 'data'],
    client: ['controls', 'displays', 'sources', 'settings', 'log', 'midi'],
    setup: ['displays', 'data', 'settings'],
    monitor: ['displays', 'controls', 'settings', 'sources'], // displays added to have updates on resolution. HC.Monitor.init() takes care of the other settings.
    log: ['log']
};

let sourcesGroups = {
    animation: ['controls', 'displays', 'sources', 'attr', 'midi', 'log', 'data'],
    controller: ['controls', 'displays', 'sources', 'settings', 'log', 'attr', 'midi'],
    client: ['log'],
    setup: ['displays', 'data', 'settings'],
    monitor: ['log']
};

let log = {};

let checkups = [
    function (ses) {
        if (ses && 'controls' in ses) {
            if (ses.controls.monitor) {
                return false;
            }
        }
        return true;
    }
];

let groupsCheckups = {
    animation: checkups,
    controller: [],
    client: checkups,
    setup: checkups,
    monitor: []
};

if (process.argv.length > 2) {
    if (process.argv[2] === 'log') {
        log[process.argv[3]] = true;
        console.log('log', log);
    }
}

_startListening();

app.use(express.static('..'));

_initGet();
_cron();
_initConnection();

/**
 *
 */
function _cron() {
    setTimeout(function () {

        for (let key in sessions) {
            let session = sessions[key];

            if (!session.blocked && session.active) {

                let path = filePath(_SESSIONS, key);

                session.active = false;
                let config = {
                    dir: path,
                    file: 'controls.json',
                    contents: (session.controls ? JSON.stringify(session.controls, null, 4) : '')
                };

                _save(config);

                config = {
                    dir: path,
                    file: 'displays.json',
                    contents: (session.displays ? JSON.stringify(session.displays, null, 4) : '')
                };

                _save(config);

                config = {
                    dir: path,
                    file: 'sources.json',
                    contents: (session.sources ? JSON.stringify(session.sources, null, 4) : '')
                };

                _save(config);

                config = {
                    dir: path,
                    file: 'settings.json',
                    contents: (session.settings ? JSON.stringify(session.settings, null, 4) : '')
                };

                _save(config);
            }
        }

        _cron();

    }, 2 * 1000);
}

/**
 *
 * @param data
 * @returns {boolean}
 * @private
 */
function _emit(data) {
    let sid = data.sid;
    let session = sessions[sid];
    let action = data.action;
    let from = data.from;
    let source = from.substr(0, from.length - sid.length - 1);
    let sent = false;

    if (_validSource(source, action)) {
        for (let t = 0; t < members.length; t++) {
            let target = members[t];
            let name = target + '@' + sid;
            if (name != from) {
                if (_validTarget(target, action, session)) {
                    io.to(name).emit(action, data);
                    sent = true;
                }
            }
        }
    }


    return sent;
}

/**
 *
 * @param source
 * @param action
 * @returns {boolean}
 * @private
 */
function _validSource(source, action) {
    let pass = false;

    if (source in sourcesGroups) {
        let group = sourcesGroups[source];
        if (group.indexOf(action) !== -1) {
            pass = true;
        }
    }

    return pass;
}

/**
 *
 * @param target
 * @param action
 * @param session
 * @returns {boolean}
 * @private
 */
function _validTarget(target, action, session) {
    let pass = false;

    if (target in targetsGroups) {
        let group = targetsGroups[target];
        if (group.indexOf(action) !== -1) {
            if (target in groupsCheckups) {
                let checkups = groupsCheckups[target];
                pass = true;
                for (let c = 0; c < checkups.length; c++) {
                    let _checkup = checkups[c];
                    if (!_checkup(session)) {
                        pass = false;
                        break;
                    }
                }
            }
        }
    }

    return pass;
}

/**
 *
 * @param data
 * @param callback
 * @private
 */
function _restore(data, callback) {

    sessions[data.sid] = {active: false, blocked: true};
    let root = filePath(_HOME, _SESSIONS, data.sid);
    let config = {
        sid: data.sid,
        section: 'controls',
        file: filePath(root, 'controls.json')
    };

    let _txt = function (section, file) {
        return 'restoring ' + section + ' from ' + file;
    };
    let _finish = function (config, contents) {
        console.log(_txt(config.section, config.file));
        sessions[config.sid][config.section] = contents;
    };
    let _validate = function (config, result) {
        if (result && result.contents) {
            _finish(config, JSON.parse(result.contents));

        } else if (conf.defaults[config.section]) {
            config.file = 'backup';
            _finish(config, conf.defaults[config.section]);
        }
    };

    _load(config, function (result) {
        _validate(config, result);

        config.section = 'displays';
        config.file = filePath(root, 'displays.json');
        _load(config, function (result) {
            _validate(config, result);

            config.section = 'sources';
            config.file = filePath(root, 'sources.json');
            _load(config, function (result) {
                _validate(config, result);

                config.section = 'settings';
                config.file = filePath(root, 'settings.json');
                _load(config, function (result) {
                    _validate(config, result);

                    callback(data);

                }, true);
            }, true);
        }, true);
    }, true);
}

/**
 *
 * @param data
 * @param callback
 * @private
 */
function _save(data, callback) {

    callback = callback || function () {
    };

    let dir = filePath(_HOME, data.dir);
    let file = filePath(dir, data.file);

    _existCreate(dir);

    if (data.file) {
        let contents = data.contents;//.replace(/,"/g, ",\n\"");
        fs.writeFile(file, contents, function (err) {
            if (err) {
                console.log(err);
                callback('error: ' + err)

            } else {
                //console.log(file + ' written');
                callback(file + ' written');

            }
        });
    } else {
        callback(dir + ' written');
    }
}


/**
 *
 * @param data
 * @param callback
 * @private
 */
function _writeBinary(data, callback) {

    let dir = data.dir;
    let file = filePath(dir, data.file);

    _existCreate(dir);

    if (data.file) {
        let buffer = data.contents;
        fs.writeFile(file, buffer.toString('binary'), 'binary', function (err) {
            if (err) {
                console.log(err);

            } else {
                //console.log(file + ' written');
                callback(file + ' written');
            }
        });
    }
}

/**
 *
 * @param data
 * @param unstorable
 * @private
 */
function _store(data, unstorable = []) {
    let proceed = function (data) {
        let session = sessions[data.sid];

        session.active = true;
        session.blocked = true;
        if (!(data.action in session)) {
            session[data.action] = {}
        }

        let section = session[data.action];

        let settings = false;
        if ('layer' in data) {
            if (!(data.layer in section)) {
                section[data.layer] = {};
            }

            settings = section[data.layer];

        } else {
            settings = section;
        }

        for (let k in data.data) {
            let v = data.data[k];
            if (typeof v === 'object') { // most likely to be case with ControlSets
                if (!(k in settings)) {
                    settings[k] = {};
                }
                for (let i in v) {
                    if (!(unstorable.includes(k)))
                        settings[k][i] = v[i];
                }
            } else { // old structure used for control/display/source settings
                if (!(unstorable.includes(k)))
                    settings[k] = v;
            }
        }

        session.blocked = false;
    };

    data = JSON.parse(JSON.stringify(data, null, 4));

    if (!(data.sid in sessions)) {
        _restore(data, proceed);

    } else {
        proceed(data);
    }
}

/**
 *
 * @param data
 * @param callback
 * @param forceCallback
 * @private
 */
function _load(data, callback, forceCallback) {
    let file = data.file;
    fs.readFile(file, 'utf8', function (err, contents) {

        if (err) {
            data.action = 'log';
            data.value = err;
            if (forceCallback) {
                callback(data);
            }

        } else {
            data.contents = contents;
            callback(data);
        }
    });
}

/**
 *
 * @param req
 * @param sources
 * @returns {string}
 * @private
 */
function _sources(req, sources) {

    let compress = false;
    let name = req.originalUrl.replace('bin/', '');

    _existCreate(_BIN);

    let file = filePath(_BIN, name.substr(1)); // do not use file_path! req originalUrl already contains leading slash ...
    let files = [];
    let __find = function (list, base) {
        for (let i = 0; i < list.length; i++) {
            let f = filePath(base, list[i]);

            let exists = false;

            try {
                exists = fs.existsSync(f);
            } catch (e) {

            }

            if (exists) {
                if (fs.statSync(f).isDirectory()) {
                    let subs = exists ? fs.readdirSync(f) : [];

                    subs.sort(function (a, b) {
                        let fa = filePath(f, a);
                        let fb = filePath(f, b);
                        let ad = fs.statSync(fa).isDirectory() ? 1 : 0;
                        let bd = fs.statSync(fb).isDirectory() ? 1 : 0;

                        if (ad != bd) {
                            return ad - bd;
                        }

                        return a.localeCompare(b);
                    });

                    __find(subs, f);

                } else {
                    files.push(f);
                }
            }
        }
    };

    __find(sources, _APP);
    _concat(files, file, compress);

    return file;
}

/**
 *
 * @param files
 * @param file
 * @private
 */
function _concat(files, file) {

    try {
        let result = {code: ''};
        files.forEach(function (f) {
            let code = fs.readFileSync(f, "utf8");
            result.code += "\n\n" + code;
        });

        fs.writeFileSync(file, result.code);

    } catch (e) {
        console.log(e);
        fs.writeFileSync(file, e.toString());
    }
}

/**
 *
 * @param dir
 * @param callback
 * @private
 */
function _unlinkAll(dir, callback) {
    let exists = false;
    let files = [];
    try {
        exists = fs.existsSync(dir);
    } catch (e) {
        console.log(e);
    }
    if (exists) {
        files = exists ? fs.readdirSync(dir) : [];
        files.forEach(function (file) {
            fs.unlinkSync(dir + '/' + file);
        });
    } else {
        console.log(dir + ' does not exist');
    }

    callback(files);
}

/**
 *
 * @param base
 * @returns {Array}
 * @private
 */
function _find(base) {
    let files = [];

    let walkSync = function (dir, filelist) {

        let exists = false;
        try {
            exists = fs.existsSync(dir);
        } catch (e) {

        }
        let files = exists ? fs.readdirSync(dir) : [];
        filelist = filelist || [];
        files.forEach(function (file) {

            if (!file.match(/^\..+/)) { // skip hidden files
                let f = {
                    name: file,
                    dir: dir.substr(base.length + 1),
                    children: []
                };

                if (fs.statSync(dir + '/' + file).isDirectory()) {
                    f.type = 'folder';
                    f.visible = true;
                    walkSync(dir + '/' + file, f.children);

                } else {
                    f.loaded = false;
                    f.layer = '';
                    f.changed = '';
                    f.type = 'file';
                }
                filelist.push(f);
            }
        });
    };

    walkSync(base, files);

    console.log('sending ' + files.length + ' files');

    return files;
}

/**
 *
 * @param sec
 * @param data
 * @private
 */
function _log(sec, data) {
    if (sec in log) {
        console.log(data);
    }
}

/**
 *
 */
function _initGet() {

    /**
     *
     */
    app.get('/', function (req, res) {
        res.sendFile(path.resolve('app/inline.html'));
    });

    /**
     *
     */
    app.get('*.html', function (req, res) {
        res.sendFile(path.resolve('app/' + req.originalUrl));
    });

    /**
     *
     */
    app.get('*worker/*.js', function (req, res) {
        res.sendFile(path.resolve('app/js' + req.originalUrl));
    });

    /**
     *
     */
    app.get('/node_modules/*.js', function (req, res) {
        let url = req.originalUrl.replace('/', '');
        url = path.resolve(url);
        res.sendFile(url);
    });

    /**
     *
     */
    app.get('/app/lib/*', function (req, res) {
        let url = req.originalUrl.replace('/', '') + '.js';
        url = path.resolve(url);
        res.sendFile(url);
    });

    /**
     *
     */
    app.get('/bin/animation.js', function (req, res) {

        let sources = [].concat(conf.shared).concat(conf.animation);
        let file = _sources(req, sources);

        res.sendFile(file);

    });

    /**
     *
     */
    app.get('/bin/controller.js', function (req, res) {

        let sources = [].concat(conf.shared).concat(conf.controller);
        let file = _sources(req, sources);

        res.sendFile(file);
    });

    /**
     *
     */
    app.get('/bin/addons.js', function (req, res) {

        let sources = [].concat(conf.addons);
        let file = _sources(req, sources);

        res.sendFile(file);

    });

    /**
     *
     */
    app.get('/lib/*.js', function (req, res) {
        res.sendFile(filePath(_APP, req.originalUrl.substr(1)));
    });

    /**
     *
     */
    app.get('/css/*.css', function (req, res) {
        res.sendFile(filePath(_APP, req.originalUrl.substr(1)));
    });

    /**
     *
     */
    app.get('/img/*.png', function (req, res) {
        res.sendFile(filePath(_APP, req.originalUrl.substr(1)));
    });

    /**
     *
     */
    app.get('/samples/*/*.png', function (req, res) {
        res.sendFile(filePath(_ROOT, req.originalUrl.substr(1)));
    });

    /**
     *
     */
    app.get('/assets/*', function (req, res) {
        let url = filePath(_HOME, req.originalUrl.substr(1));
        res.sendFile(url, {}, function (err) {
            if (err) {
                console.log(url, err);
            }
        });
    });

    /**
     *
     */
    app.get('*', function (req, res) {
        console.log('sending fallback', req.originalUrl);
        res.sendFile(_APP + '/favicon.ico');
    });
}

function filePath() {
    let args = Array.prototype.slice.call(arguments);
    return args.join('/');
}

function _callIfDefined(callback) {
    if (callback) {
        callback();
    }
}

/**
 *
 * @param dir
 * @param feedback
 * @returns {string}
 * @private
 */
function _existCreate(dir, feedback) {
    let returnValue = '';
    try {
        if (!fs.existsSync(dir)) {
            returnValue = ('creating ' + dir);
            fs.mkdirSync(dir, {recursive: true});

        } else {
            returnValue = (dir + ' ok');
        }

    } catch (e) {
        console.log(e);
    }

    return returnValue;
}

function _getNetworkIPs() {
    const nets = networkInterfaces();
    const results = ['localhost'];

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                results.push(net.address);
            }
        }
    }

    return results;
}

function _logConnectionInfo() {
    console.log('server running on port: ' + _PORT);
    let proto = _HTTPS ? 'https' : 'http';

    let networkIPs = _getNetworkIPs();
    console.log('with the following links you can start visualizing:')
    for (const networkIP of networkIPs) {
        console.log(proto + '://' + networkIP + ':' + _PORT + ' (inline)');
        console.log(proto + '://' + networkIP + ':' + _PORT + '/controller.html (controller)');
        console.log(proto + '://' + networkIP + ':' + _PORT + '/animation.html (animation)');
    }
}

function _startListening() {
    server.listen(_PORT).addListener('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error('port ' + _PORT + ' is already in use. terminating.');
            process.exit(1);
        } else {
            throw error;
        }
    }).addListener('listening', () => {
        _logConnectionInfo();
    });
}

function _initConnection() {

    /**
     *
     */
    io.sockets.on('connection', function (socket) {

        socket.on('join', function (data) {
            _log('join', data);
            socket.join(data.name);
        });

        socket.on('log', function (data, callback) {
            _log('log', data);
            if (_emit(data)) {
                _callIfDefined(callback);
            }
        });

        socket.on('attr', function (data, callback) {
            _log('attr', data);
            if (_emit(data)) {
                _callIfDefined(callback);
            }
        });

        socket.on('midi', function (data, callback) {
            _log('midi', data);
            if (_emit(data)) {
                _callIfDefined(callback);
            }
        });

        socket.on('data', function (data, callback) {
            _log('data', data);
            if (_emit(data)) {
                _callIfDefined(callback);
            }
        });

        socket.on('controls', function (data, callback) {
            _log('controls', data);
            if (_emit(data)) {
                _store(data, conf.unstorable.controls);
                _callIfDefined(callback);
            }
        });

        socket.on('displays', function (data, callback) {
            _log('displays', data);
            if (_emit(data)) {
                _store(data, conf.unstorable.displays);
                _callIfDefined(callback);
            }
        });

        socket.on('sources', function (data, callback) {
            _log('sources', data);
            if (_emit(data)) {
                _store(data, conf.unstorable.sources);
                _callIfDefined(callback);
            }
        });

        socket.on('settings', function (data, callback) {
            _log('settings', data);
            if (_emit(data)) {
                _store(data, conf.unstorable.settings);
                _callIfDefined(callback);
            }
        });

        socket.on('sync', function (data, callback) {
            _log('sync', data);
            let _finish = function (data) {
                let target = data.from.substr(0, data.from.length - data.sid.length - 1);
                let session = sessions[data.sid];
                let keys = Object.keys(session);
                let result = {};
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    if (_validTarget(target, key, false)) { // false instead of session to avoid checkups (regarding monitor)
                        result[key] = session[key];
                    }
                }

                callback(result);
            };

            // restore from session (RAM)
            if (data.sid && data.sid in sessions) {
                _finish(data);

                // restore from session (FILE)
            } else if (data.sid) {
                _restore(data, _finish);
            }
        });

        /**
         *
         */
        socket.on('files', function (data, callback) {

            _log('files', data);
            console.log('searching files in ' + data.file);

            let files = _find(filePath(_HOME, data.file));
            data.data = files;

            callback(files);
        });

        /**
         *
         */
        socket.on('samples', function (data, callback) {

            _log('files', data);
            console.log('searching files in ' + data.file);

            let files = _find(data.file);
            data.data = files;

            callback(files);
        });

        /**
         *
         */
        socket.on('save', _save);

        /**
         *
         */
        socket.on('mkdir', _save);

        /**
         *
         */
        socket.on('write', _writeBinary);

        /**
         *
         */
        socket.on('rename', function (data, callback) {
            let old = filePath(_HOME, data.dir, data.file);
            let nu = filePath(_HOME, data.dir, data.nu);
            fs.rename(old, nu, function () {
                let msg = data.file + ' renamed to ' + data.nu;
                callback(msg);
            });
        });

        /**
         *
         */
        socket.on('delete', function (data, callback) {
            let old = filePath(_HOME, data.dir, data.file);
            let nu = filePath(_HOME, data.dir, '.' + data.file);
            fs.rename(old, nu, function () {
                let msg = data.file + ' deleted';
                console.log(msg);
                callback(msg);
            });
        });

        /**
         *
         */
        socket.on('unlinkall', function (data, callback) {
            let dir = filePath(_ROOT, data.dir);
            _unlinkAll(dir, callback);
        });

        /**
         *
         */
        socket.on('config', _load);

        /**
         *
         */
        socket.on('load', (data, callback) => {
            data.file = filePath(_HOME, data.file);
            _load(data, callback);
        });
    });

}