// import('socket.io/socket.io.js');
importScripts('../socket.io/socket.io.js');

let socket = io.connect(null, {'secure': true, 'forceNew': true});

socket.once('connect', () => {

    console.log('connected'); // fixme transfer canvae and store.

});
