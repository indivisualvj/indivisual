// handling media files inspired by https://uberviz.io/viz/word-problems/
{
    if (IS_ANIMATION) {
        document.addEventListener('DOMContentLoaded', function () {
            console.log('HC.audio.mp3: adding events for playback on media file drop');
            document.addEventListener('dragover', function (e) {
                e.preventDefault();
            }, false);

            let onDocumentDrop = function (e) {
                e.preventDefault();

                if (e.dataTransfer.files.length) {
                    HC.audio.mediafile.dropEvent = e;
                    animation.updateControl('audio', 'mediafile', true, true, false);
                }
            };

            document.addEventListener('drop', onDocumentDrop, false);
        });
    }

    HC.audio.mediafile = class Plugin extends HC.AudioPlugin {

        static dropEvent = false;
        buffer;

        init(callback) {
            if (!HC.audio.mediafile.dropEvent) {
                alert('You can now drag/drop a media file into the animation window');

            } else {
                this.onDrop(HC.audio.mediafile.dropEvent, callback);
                HC.audio.mediafile.dropEvent = false;
            }
        }

        start() {
            if (this.source) {
                this.source.connect(this.context.destination);
                this.source.buffer = this.buffer;
                this.source.loop = true;
                this.source.start(0.0);
            }
        }

        onDrop(evt, callback) {
            let inst = this;
            let droppedFiles = evt.dataTransfer.files;
            let reader = new FileReader();
            reader.onload = function (fileEvent) {
                let data = fileEvent.target.result;
                inst.onLoaded(data, callback);
            };
            reader.readAsArrayBuffer(droppedFiles[0]);
        }

        onLoaded(data, callback) {
            let inst = this;

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
                if (callback) {
                    callback(this.source);
                }
            }
        }
    }
}