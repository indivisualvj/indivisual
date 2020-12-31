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
            alphaMap: null,
            aoMap: null,
            bumpMap: null,
            bumpScale: null,
            displacementMap: null,
            displacementScale: null,
            displacementBias: null,
            lightMap: null,
            metalnessMap: null,
            normalMap: null,
            roughnessMap: null
        };

        apply() {
            if (!this.properties.map) {
                this.initTexture();
            }

            return false
        }

        initTexture() {
            let that = this;
            navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
                    let videoSettings = stream.getVideoTracks()[0].getSettings();
                    let video = document.createElement("video");
                    Object.assign(video, {
                        srcObject: stream,
                        //height: videoSettings.height,
                        //width: videoSettings.width,
                        autoplay: true
                    });
                    //document.body.appendChild(video);
                    let videoTexture = new THREE.VideoTexture(video);
                    videoTexture.minFilter = THREE.LinearFilter;
                    that.properties.map = videoTexture;
                    that.properties.emissiveMap = videoTexture;
                }
            ).catch(function(error){console.error(error);});
        }
    }
}
