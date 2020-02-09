let name = 'load-worker';

onmessage = function (ev) {
    let length = ev.data.length;
    let files = ev.data.files;
    let blobs = ev.data.blobs;
    let path = ev.data.path;

    let loaded = 0;

    for (let i = 0; i < length; i++) {
        let file = files[i].name;
        file = path + '/' + file;

        load(file, i, (blob, index) => {
            blob.arrayBuffer().then((buf) => {
                blobs[index] = buf;
                    loaded++;
                if (loaded >= length) {
                    self.postMessage({id: ev.data.id, blobs: blobs}, blobs);
                }
            });

        });
    }
};

/**
 *
 * @param file
 * @param index
 * @param callback
 */
function load(file, index, callback) {
    fetch('../../../' + file).then((response) => {
        response.blob().then((blob) => {
            callback(blob, index);
        })
    });
}

console.log(name + ' loaded');
