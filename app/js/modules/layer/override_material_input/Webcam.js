/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OverrideMaterialInputPlugin} from "../OverrideMaterialInputPlugin";
import {LinearFilter, VideoTexture} from "three";

class webcam extends OverrideMaterialInputPlugin {

        /**
         * @type {MediaStream}
         */
        stream;

        properties = {
            map: null,
            emissiveMap: null,
        };

        apply() {
            if (!this.properties.map) {
                this.initTexture();
            }

            return false
        }

        initTexture() {
            let that = this;
            try {
                let resolution = this.animation.getResolution();
                let config = {
                    video: {
                        width: {min: 640, ideal: resolution.x, max: 1920},
                        height: {min: 360, ideal: resolution.y, max: 1080},
                    }
                }
                navigator.mediaDevices.getUserMedia(config).then( (stream) => {
                    let video = document.createElement("video");
                    Object.assign(video, {
                        srcObject: stream,
                        autoplay: true
                    });
                    this.stream = stream;

                    let videoTexture = new VideoTexture(video);
                    videoTexture.minFilter = LinearFilter;
                    that.properties.map = videoTexture;
                    that.properties.emissiveMap = videoTexture;
                }).catch(function (error) {
                    console.error(error);
                });
            } catch (ex) {
                console.log(ex);
            }
        }
// fixme: if back on "none", does not reset on all layers immediately
        reset() {
            if (this.video) {
                this.stream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
            super.reset();
        }
    }

export {webcam};
