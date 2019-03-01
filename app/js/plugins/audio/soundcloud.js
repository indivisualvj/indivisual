{
    var SOUNDCLOUD_CLIENT_ID = '118f93afdbb12c9d2f2ed3551478feab'; // todo stolen client_id (https://codepen.io/jadiego/pen/ONwwJB)

    if (IS_ANIMATION) {

        document.addEventListener('DOMContentLoaded', function () {
            console.log('HC.audio.soundcloud: adding events for playback on soundcloud url drop');

            var script = document.createElement('script');
            script.setAttribute('src', 'https://connect.soundcloud.com/sdk/sdk-3.3.1.js');

            script.onload = function () {

                SC.initialize({
                    client_id: SOUNDCLOUD_CLIENT_ID
                });

                document.addEventListener('dragover', function (e) {
                    e.preventDefault();
                }, false);

                var onDocumentDrop = function (e) {
                    e.preventDefault();

                    var url = e.dataTransfer.getData('URL');
                    if (url && url.match(/https:\/\/soundcloud.com.+/)) {
                        HC.audio.soundcloud.dropEvent = e;
                        animation.updateControl('audio', 'soundcloud', true, true, false);
                    }
                };

                document.addEventListener('drop', onDocumentDrop, false);

            };
            document.head.appendChild(script);

        });
    }

    HC.audio.soundcloud = class Plugin extends HC.AudioPlugin {

        static dropEvent = false;

        init(callback) {
            if (HC.audio.soundcloud.dropEvent) {
                if (!this.audioTag) {
                    var audio = document.createElement('audio');
                    audio.crossOrigin = "anonymous";
                    audio.setAttribute('controls', '');
                    document.body.append(audio);

                    var to;
                    document.addEventListener('mousemove', function () {
                        audio.style.visibility = 'visible';
                        clearTimeout(to);
                        to = setTimeout(function () {
                            audio.style.visibility = 'hidden';
                        }, 2000);
                    });

                    this.audioTag = audio;
                }

                this.onDrop(HC.audio.soundcloud.dropEvent, callback);
                HC.audio.soundcloud.dropEvent = false;

            } else {
                alert('You can now drag/drop a soundcloud url into the animation window');
            }
        }

        onDrop(e, callback) {
            var inst = this;
            var url = e.dataTransfer.getData('URL');
            SC.resolve(url).then(function (sound) {

                var onCanPlay = function () {
                    inst.audioTag.removeEventListener('canplay', onCanPlay);
                    inst.audioTag.play();
                    inst.source = inst.context.createMediaElementSource(inst.audioTag);
                    callback(inst.source);
                };

                inst.audioTag.addEventListener('canplay', onCanPlay);
                inst.audioTag.setAttribute('src', sound.stream_url + '?client_id=' + SOUNDCLOUD_CLIENT_ID);
                // onCanPlay();

            });

        }

        start() {
            if (this.source) {
                this.source.connect(this.context.destination);
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