

(function () {
    /**
     *
     * @param index
     * @constructor
     */
    HC.Perspective = function (index) {
        this.type = 'Perspective';
        this.index = index;
        this.id = this.type + this.index;
        this._bounds = false;
        this._last = 0;
        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: ANTIALIAS});
        this.renderer.view = this.renderer.domElement;
        this.renderer.view.id = this.id;
    };

    HC.Perspective.prototype = {

        /**
         *
         * @param width
         * @param height
         */
        update: function (width, height) {
            var checkWidth = this.width != width;
            var checkHeight = this.height != height;
            var needsUpdate = checkWidth || checkHeight;
            this.width = width;
            this.height = height;
            this.renderer.setSize(this.width, this.height);

            if (needsUpdate) {
                this.init();
            }
        },

        /**
         *
         */
        init: function () {

        },

        /**
         *
         * @param reference
         * @returns {*}
         */
        bounds: function (reference) {
            return reference;
        },

        /**
         *
         * @returns {*}
         */
        brightness: function () {
            return displayman.brightness();
        },

        /**
         *
         * @param fallback
         * @returns {*}
         */
        current: function (fallback) {
            if (this._last == animation.now) {
                return this.renderer.view;
            }

            return fallback;
        },

        /**
         *
         */
        next: function () {

            if (this._last != animation.now) {
                var key = 'perspective' + this.index;
                var three = renderer.currentLayer.three;
                var cam = renderer.three[key];
                cam.position.x = 0;
                cam.position.y = 0;
                cam.position.z = three.camera.position.z;
                cam.rotation.x = three.camera.rotation.x;
                cam.rotation.y = three.camera.rotation.y + statics.DisplaySettings[key + '_angle'] * RAD;
                cam.rotation.z = three.camera.rotation.z;
                cam.fov = three.camera.fov * statics.DisplaySettings[key + '_fov'];
                cam.zoom = three.camera.zoom * statics.DisplaySettings[key + '_zoom'];

                cam.updateProjectionMatrix();

                this.renderer.render(three.scene, cam);

                this._last = animation.now;
            }
        }

    };

}());