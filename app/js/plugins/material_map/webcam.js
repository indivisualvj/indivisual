/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.plugins.material_map.webcam = class Plugin extends HC.MaterialMapPlugin {

        file;
        loading;

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
                navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
                        let video = document.createElement("video");
                        Object.assign(video, {
                            srcObject: stream,
                            autoplay: true
                        });

                        let videoTexture = new THREE.VideoTexture(video);
                        videoTexture.minFilter = THREE.LinearFilter;
                        that.properties.map = videoTexture;
                        that.properties.emissiveMap = videoTexture;
                    }
                ).catch(function (error) {
                    console.error(error);
                });
            } catch (ex) {
                console.log(ex);
            }
        }
    }
}
