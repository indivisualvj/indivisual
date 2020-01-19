/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Perspective}
     */
    HC.Perspective = class Perspective {

        /**
         *
         * @param index
         */
        constructor(index) {
            this.type = 'Perspective';
            this.index = index;
            this.id = this.type + this.index;
            this._bounds = false;
            this._last = 0;
            this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: ANTIALIAS});
            this.renderer.view = this.renderer.domElement;
            this.renderer.view.id = this.id;
        }

        /**
         *
         * @param width
         * @param height
         */
        update(width, height) {
            let checkWidth = this.width != width;
            let checkHeight = this.height != height;
            let needsUpdate = checkWidth || checkHeight;
            this.width = width;
            this.height = height;
            this.renderer.setSize(this.width, this.height);

            if (needsUpdate) {
                this.init();
            }
        }

        /**
         *
         */
        init() {

        }

        /**
         *
         * @param reference
         * @returns {*}
         */
        bounds(reference) {
            return reference;
        }

        /**
         *
         * @returns {*}
         */
        brightness() {
            return displayman.brightness();
        }

        /**
         *
         * @param fallback
         * @returns {*}
         */
        current(fallback) {
            if (this._last == animation.now) {
                return this.renderer.view;
            }

            return fallback;
        }

        /**
         *
         */
        next() {

            if (this._last != animation.now) {
                let key = 'perspective' + this.index;
                let layer = renderer.currentLayer;
                let three = layer.three;
                let cam = renderer.three[key];
                let lcam = three.camera;
                cam.position.x = lcam.position.x;
                cam.position.y = lcam.position.y;
                cam.position.z = lcam.position.z;
                cam.rotation.x = lcam.rotation.x;
                cam.rotation.y = lcam.rotation.y + statics.DisplaySettings[key + '_angle'] * RAD;
                cam.rotation.z = lcam.rotation.z;
                cam.fov = lcam.fov * statics.DisplaySettings[key + '_fov'];
                cam.zoom = lcam.zoom * statics.DisplaySettings[key + '_zoom'];

                cam.updateProjectionMatrix();

                this.renderer.render(three.scene, cam);

                this._last = animation.now;
            }
        }
    }
}