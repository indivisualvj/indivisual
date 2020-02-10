let name = 'store-worker';

importScripts('../worker/socket.io-connect.js');

let canvas = new OffscreenCanvas(1, 1);
let context = canvas.getContext('2d');

/**
 *
 * @param path
 * @param file
 * @param data
 * @param from
 * @param sid
 */
let sample = function (path, file, data, from, sid, callback) {
    let conf = {
        action: 'sample',
        dir: path,
        file: file,
        contents: data
    };

    conf.sid = sid;
    conf.from = from;
    socket.emit('sample', conf, callback);

};


onmessage = function (ev) {
    let length = ev.data.length;
    let samples = ev.data.samples;
    let scale = ev.data.scale;
    let path = ev.data.path;
    let sid = ev.data.sid;

    if (samples.length) {
        canvas.width = samples[0].width * scale;
        canvas.height = samples[0].height * scale;

        let stored = 0;

        for (let i = 0; i < length; i++) {
            let frame = samples[i];

            setTimeout(() => {
                if (scale && scale !== 1.0) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(frame, 0, 0, frame.width, frame.height, 0, 0, canvas.width, canvas.height);
                    frame = canvas;
                }

                frame.convertToBlob({
                    type: "image/png"
                }).then((blob) => {
                    sample(path, i + '.png', blob, name, sid, () => {
                        stored++;
                        if (stored >= length) {
                            self.postMessage({id: ev.data.id, samples: samples}, samples);
                        }
                    });
                });
            }, i*2);
        }

    } else {
        self.postMessage({id: ev.data.id, samples: samples}, samples);
    }
};
