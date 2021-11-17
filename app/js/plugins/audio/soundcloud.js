{
    let SOUNDCLOUD_CLIENT_ID = '118f93afdbb12c9d2f2ed3551478feab'; // ugly stolen client_id (https://codepen.io/jadiego/pen/ONwwJB)

    if (IS_ANIMATION) {

        document.addEventListener('DOMContentLoaded', function () {
            console.log('HC.AudioManager.plugins.soundcloud: adding events for playback on soundcloud url drop');

            let script = document.createElement('script');
            script.setAttribute('src', 'https://connect.soundcloud.com/sdk/sdk-3.3.1.js');

            script.onload = function () {

                SC.initialize({
                    client_id: SOUNDCLOUD_CLIENT_ID
                });

                document.addEventListener('dragover', function (e) {
                    e.preventDefault();
                }, false);

                let onDocumentDrop = function (e) {
                    e.preventDefault();

                    let url = e.dataTransfer.getData('URL');
                    if (url && url.match(/https:\/\/soundcloud.com.+/)) {
                        HC.AudioManager.plugins.soundcloud.dropEvent = e;
                        messaging.program.updateControl('audio', 'soundcloud', true, true, false);
                    }
                };

                document.addEventListener('drop', onDocumentDrop, false);

            };
            document.head.appendChild(script);

        });
    }

    HC.AudioManager.plugins.soundcloud = class Plugin extends HC.AudioPlugin {
        static index = 30;
        static tutorial = {
            howto: {
                text: 'You now can drag/drop a soundcloud url into the animation window'
            }
        };
        static dropEvent = false;

        init(callback) {
            if (HC.AudioManager.plugins.soundcloud.dropEvent) {
                if (!this.audioTag) {
                    let audio = document.createElement('audio');
                    audio.crossOrigin = "anonymous";
                    audio.setAttribute('controls', '');
                    document.body.append(audio);

                    let to;
                    document.addEventListener('mousemove', function () {
                        audio.style.visibility = 'visible';
                        clearTimeout(to);
                        to = setTimeout(function () {
                            audio.style.visibility = 'hidden';
                        }, 2000);
                    });

                    this.audioTag = audio;
                }

                this.onDrop(HC.AudioManager.plugins.soundcloud.dropEvent, callback);
                HC.AudioManager.plugins.soundcloud.dropEvent = false;

            } else {
                // now in tutorial
            }
        }

        onDrop(e, callback) {
            let url = e.dataTransfer.getData('URL');
            SC.resolve(url).then((sound) => {

                let onCanPlay = () => {
                    this.audioTag.removeEventListener('canplay', onCanPlay);
                    this.audioTag.play();
                    this.source = this.getContext().createMediaElementSource(this.audioTag);
                    callback(this.source);
                };

                this.audioTag.addEventListener('canplay', onCanPlay);
                this.audioTag.setAttribute('src', sound.stream_url + '?client_id=' + SOUNDCLOUD_CLIENT_ID);

            });

        }

        start() {
            if (this.source) {
                this.source.connect(this.getContext().destination);
            }
        }

        stop() {
            this.disconnect();

            if (this.audioTag) {
                document.body.removeChild(this.audioTag);
            }
        }
    }
}
