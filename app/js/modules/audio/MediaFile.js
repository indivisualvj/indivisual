/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AudioPlugin} from "../AudioPlugin";

class MediaFile extends AudioPlugin {
    static index = 20;
    static tutorial = {
        howto: {
            text: 'You now can drag/drop a media file into the animation window'
        }
    };
    static dropEvent = false;
    buffer;

    static boot(initiator, config) {
        if (IS_ANIMATION) {
            console.log('MediaFile', 'adding events for playback on media file drop');
            document.addEventListener('dragover', function (e) {
                e.preventDefault();
            }, false);

            let onDocumentDrop = function (e) {
                e.preventDefault();

                if (e.dataTransfer.files.length) {
                    MediaFile.dropEvent = e;
                    config.getMessaging().program.updateControl('audio', 'media_file', true, true, false);
                }
            };

            document.addEventListener('drop', onDocumentDrop, false);
        }
    }

    init(callback) {
        if (MediaFile.dropEvent) {
            this.onDrop(MediaFile.dropEvent, callback);
            MediaFile.dropEvent = false;

        } else {
            // now in tutorial
        }
    }

    start() {
        if (this.source) {
            this.source.connect(this.manager.initContext().destination);
            this.source.buffer = this.buffer;
            this.source.loop = true;
            this.source.start(0.0);
        }
    }

    onDrop(evt, callback) {
        let droppedFiles = evt.dataTransfer.files;
        let reader = new FileReader();
        reader.onload = (fileEvent) => {
            let data = fileEvent.target.result;
            this.onLoaded(data, callback);
        };
        reader.readAsArrayBuffer(droppedFiles[0]);
    }

    onLoaded(data, callback) {

        let context = this.getContext();
        if (context.decodeAudioData) {
            context.decodeAudioData(
                data,
                (buffer) => {
                    this.source = context.createBufferSource();
                    this.buffer = buffer;

                    if (callback) {
                        callback(this.source);
                    }
                },
                function (e) {
                    console.log(e);
                }
            );
        } else {
            this.source = context.createBufferSource();
            this.buffer = context.createBuffer(data, false);
            if (callback) {
                callback(this.source);
            }
        }
    }
}

export {MediaFile}