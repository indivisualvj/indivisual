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
         * @type {HC.Animation}
         */
        animation;

        /**
         * @type {HC.DisplayManager}
         */
        displayManager;

        /**
         * @type {HC.Renderer}
         */
        renderer;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         *
         * @param {HC.Animation} animation
         * @param index
         */
        constructor(animation, index) {
            this.animation = animation;
            this.config = animation.config;
            this.displayManager = animation.displayManager;
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
            return this.displayManager.brightness();
        }

        /**
         *
         * @param fallback
         * @returns {*}
         */
        current(fallback) {
            if (this._last == this.animation.now) {
                return this.renderer.view;
            }

            return fallback;
        }

        /**
         *
         */
        next() {

            if (this._last != this.animation.now) {
                let key = 'perspective' + this.index;
                let layer = this.animation.renderer.currentLayer;
                let three = layer.three;
                let cam = this.animation.renderer.three[key];
                let lcam = three.camera;
                cam.position.x = lcam.position.x;
                cam.position.y = lcam.position.y;
                cam.position.z = lcam.position.z;
                cam.rotation.x = lcam.rotation.x;
                cam.rotation.y = lcam.rotation.y + this.config.DisplaySettings[key + '_angle'] * RAD;
                cam.rotation.z = lcam.rotation.z;
                cam.fov = lcam.fov * this.config.DisplaySettings[key + '_fov'];
                cam.zoom = lcam.zoom * this.config.DisplaySettings[key + '_zoom'];

                cam.updateProjectionMatrix();

                this.renderer.render(three.scene, cam);

                this._last = this.animation.now;
            }
        }
    }
}
