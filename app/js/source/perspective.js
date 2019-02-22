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
                var layer = renderer.currentLayer;
                var three = layer.three;
                var cam = renderer.three[key];
                var lcam = three.camera;
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

    };

}());