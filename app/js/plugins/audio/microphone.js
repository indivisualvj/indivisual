{
    class Plugin extends HC.AudioPlugin {

        init(callback) {

            var inst = this;
            if (navigator.mediaDevices.getUserMedia) {

                try {
                    navigator.mediaDevices.getUserMedia({audio: true, video: false})
                        .then(
                            function (stream) {
                                inst.stream = stream;
                                inst.source = inst.context.createMediaStreamSource(stream);

                                if (callback) {
                                    callback(inst.source);
                                }
                            }
                            , function (ex) {
                                HC.log('audio', ex.message, true);
                            });
                } catch (ex) {
                    HC.log('audio', ex.message, true);
                }

            } else {
                HC.log('audio', 'could not getUserMedia', true);
            }
        }

    }

    HC.audio.microphone = Plugin;
}