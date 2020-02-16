// handling media files inspired by https://uberviz.io/viz/word-problems/
{
    if (IS_ANIMATION) {
        document.addEventListener('DOMContentLoaded', function () {
            console.log('HC.AudioManager.plugins.mp3: adding events for playback on media file drop');
            document.addEventListener('dragover', function (e) {
                e.preventDefault();
            }, false);

            let onDocumentDrop = function (e) {
                e.preventDefault();

                if (e.dataTransfer.files.length) {
                    HC.AudioManager.plugins.mediafile.dropEvent = e;
                    messaging.program.updateControl('audio', 'mediafile', true, true, false);
                }
            };

            document.addEventListener('drop', onDocumentDrop, false);
        });
    }

    HC.AudioManager.plugins.mediafile = class Plugin extends HC.AudioPlugin {
        static index = 20;
        static tutorial = {
            howto: {
                text: 'You now can drag/drop a media file into the animation window'
            }
        };
        static dropEvent = false;
        buffer;

        init(callback) {
            if (HC.AudioManager.plugins.mediafile.dropEvent) {
                this.onDrop(HC.AudioManager.plugins.mediafile.dropEvent, callback);
                HC.AudioManager.plugins.mediafile.dropEvent = false;

            } else {
                // now in tutorial
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
