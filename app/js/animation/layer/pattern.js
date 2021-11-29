/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.Layer = class Layer extends HC.Layer {

        /**
         *
         * @returns {number}
         */
        patternCenterX() {
            return this.resolution('half').x + this.cameraDefaultDistance(.25) * this.settings.pattern_centerx;
        };

        /**
         *
         * @returns {number}
         */
        patternCenterY() {
            return this.resolution('half').y + this.cameraDefaultDistance(.25) * this.settings.pattern_centery;
        };

        /**
         *
         * @returns {number}
         */
        patternCenterZ() {
            return this.cameraDefaultDistance(.25) * this.settings.pattern_centerz;
        };

        /**
         *
         * @param invertY
         * @returns {Vector3}
         */
        patternCenterVector(invertY) {
            return new THREE.Vector3(this.patternCenterX(), this.patternCenterY() * (invertY ? -1 : 1), this.patternCenterZ());
        };

    }
}