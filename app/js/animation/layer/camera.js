/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.Layer = class Layer extends HC.Layer {

        /**
         *
         * @returns {THREE.PerspectiveCamera}
         */
        getCamera() {
            return this.three.camera;
        }

        /**
         *
         */
        updateCameraFov() {
            let cam = this.getCamera();
            let sina = sinAlpha(this.resolution('half').y * 1.015, this.cameraDefaultDistance());

            cam.fov = sina * this.config.DisplaySettings.fov;
        }

        /**
         *
         * @param multiplier
         * @returns {number}
         */
        cameraDefaultDistance(multiplier) {
            return this.resolution().length() * (multiplier || 1);
        }

    }
}