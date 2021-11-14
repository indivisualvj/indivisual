{
    let SPOTIFY_ACCESS_TOKEN = 'BQBYPNKXSESRO9o7RYgcDIzUyZ-qYPhlET7-qe60ymtvkRUTwpMsIb09yyfuWLBsAewEGhRCYe4XyW492gFW4Lb-4KcxOdGFKWNlhljFNzh0Ec_Ei8Bn-EUyGMR0yilw6E7qG-DgQ7fs8rYdgOCLr8W4ffYo19X9e6NnPVjBUuzEZAUhLmZX2w';

    if (IS_ANIMATION) {

        document.addEventListener('DOMContentLoaded', function () {
            console.log('HC.AudioManager.plugins.spotify: initializing spotify');

            let script = document.createElement('script');
            script.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js');

            script.onload = function () {

                window.onSpotifyWebPlaybackSDKReady = function () {
                    console.log('HC.AudioManager.plugins.spotify: SpotifyWebPlaybackSDK ready');

                    HC.AudioManager.plugins.soundcloud.sdkReady = true;
                };

            };

            // document.head.appendChild(script);
        });
    }

    HC.AudioManager.plugins.spotify = class Plugin extends HC.AudioPlugin {
        static index = 30;
        static tutorial = {

        };
        static sdkReady = false;

        init(callback) {
            if (HC.AudioManager.plugins.soundcloud.sdkReady) {
                let player = new Spotify.Player({
                    name: 'Indivisual Spotify Player',
                    getOAuthToken: function () {return SPOTIFY_ACCESS_TOKEN; }
                });

                player.addListener('initialization_error', ({ message }) => { console.error(message); });
                player.addListener('authentication_error', ({ message }) => { console.error(message); });
                player.addListener('account_error', ({ message }) => { console.error(message); });
                player.addListener('playback_error', ({ message }) => { console.error(message); });

                // Playback status updates
                player.addListener('player_state_changed', state => { console.log(state); });

                // Ready
                player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                });

                // Not Ready
                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });

                player.connect();
            }
        }

        onDrop(e, callback) {
            let inst = this;
            let url = e.dataTransfer.getData('URL');
            SC.resolve(url).then(function (sound) {

                let onCanPlay = function () {
                    inst.audioTag.removeEventListener('canplay', onCanPlay);
                    inst.audioTag.play();
                    inst.source = inst.context.createMediaElementSource(inst.audioTag);
                    callback(inst.source);
                };

                inst.audioTag.addEventListener('canplay', onCanPlay);
                inst.audioTag.setAttribute('src', sound.stream_url + '?client_id=' + SOUNDCLOUD_CLIENT_ID);
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
