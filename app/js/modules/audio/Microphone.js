/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AudioPlugin} from "../AudioPlugin";

class Microphone extends AudioPlugin {
    static index = 10;
    static tutorial = {
        howto: {
            text: 'Please make shure that you either have a microphone connected or set audio input to monitor the right output device'
        }
    };
    stream;

    init(callback) {
        try {
            navigator.mediaDevices.getUserMedia({audio: true, video: false})
                .then(
                    (stream) => {
                        this.stream = stream;
                        this.source = this.getContext().createMediaStreamSource(stream);

                        if (callback) {
                            callback(this.source);
                        }
                    }
                    , function (ex) {
                        console.log(ex);
                    });
        } catch (ex) {
            console.log(ex);
        }
    }
}

export {Microphone}