function onDocumentDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    HC.audio.mp3.dropEvent = evt;
    animation.updateControl('audio', 'mp3', true, true, false);
}
document.addEventListener('drop', onDocumentDrop, false);

HC.audio.mp3 = _class(false, HC.AudioPlugin, {

    mp3DropEvent: false,

    init: function(callback) {
        if (!HC.audio.mp3.mp3DropEvent) {
            alert('You can now drop MP3 file into the animation window');

        } else {
            this.onMP3Drop(HC.audio.mp3.dropEvent, callback);
            HC.audio.mp3.mp3DropEvent = false;
        }
    },

    start: function () {
        this.source.buffer = this.buffer;
        this.source.loop = true;
        this.source.start(0.0);
    },

    stop: function () {

    },

    onMP3Drop: function(evt, callback) {
        var inst = this;
        var droppedFiles = evt.dataTransfer.files;
        var reader = new FileReader();
        reader.onload = function (fileEvent) {
            var data = fileEvent.target.result;
            inst.onDroppedMP3Loaded(data, callback);
        };
        reader.readAsArrayBuffer(droppedFiles[0]);
    },

    onDroppedMP3Loaded: function(data, callback) {
        var inst = this;

        if (this.context.decodeAudioData) {
            this.context.decodeAudioData(
                data,
                function (buffer) {
                    inst.source = inst.context.createBufferSource();
                    inst.buffer = buffer;

                    if (callback) {
                        callback(inst.source);
                    }
                },
                function (e) {
                    console.log(e);
                }
            );
        } else {
            this.source = inst.context.createBufferSource();
            this.buffer = inst.context.createBuffer(data, false);
        }
    }

});