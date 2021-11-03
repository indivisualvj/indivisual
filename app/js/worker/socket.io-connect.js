importScripts('../socket.io/socket.io.js');
let socket = io.connect(null, {'secure': true, 'forceNew': true});

let join = function (name) {
    socket.emit({action: 'join', name: name});
};

socket.once('connect', () => {
    console.log(name + ' connected');
    join(name);

    socket.on('connect', () => {
        console.log(name + ' connected');
        join(name);
    });
});
