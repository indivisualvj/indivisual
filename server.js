#!/usr/bin/env node
'use strict';

const fs = require('fs');
const express = require('express');
const sio = require('socket.io');
const https = require('https');
const http = require('http');
const Server = require('./server/server').Server;

let options = require('./server/options');

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

let srv = new Server(app, server, io);

if (process.argv.length > 2) {
    if (process.argv[2] === 'log') {
        log[process.argv[3]] = true;
        console.log('log', log);
    }
}

srv._startListening();

app.use(express.static('..'));

srv._initGet();
srv._cron();
srv._initConnection();
