{
    HC.audio.microphone = class Plugin extends HC.AudioPlugin {
        static tutorial = {
            howto: {
                text: 'Please make shure that you either have a microphone connected or set audio input to monitor the right output device'
            }
        };
        stream;

        init(callback) {

            let inst = this;
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
}