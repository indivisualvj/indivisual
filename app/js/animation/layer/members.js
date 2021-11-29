/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.Layer = class Layer extends HC.Layer {

        /**
         *
         * @returns {HC.OverrideMaterialInputPlugin}
         */
        getOverrideMaterialInput() {
            let seq = this.config.SourceSettings.override_material_input;
            if (seq === 'webcam') {
                return this.getOverrideMaterialInputPlugin('webcam');

            } else if (seq !== 'none') {
                return this.getOverrideMaterialInputPlugin('sequence');

            }

            return this.getOverrideMaterialInputPlugin('texture');
        };

        /**
         *
         * @returns {HC.OverrideMaterialInputPlugin}
         */
        getOverrideBackgroundMode() {
            let seq = this.config.SourceSettings.override_background_mode;
            if (seq === 'webcam') {
                return this.getOverrideBackgroundModePlugin('webcam');

            } else if (seq !== 'none') {
                return this.getOverrideBackgroundModePlugin('sequence');

            }

            return null;
        };

        /**
         *
         * @param shape
         * @param x
         * @param y
         * @param z
         */
        positionIn3dSpace(shape, x, y, z) {
            let cp = new THREE.Vector3(x, y, z);
            let plugin = this.getPatternRotationPlugin();
            plugin.positionIn3dSpace(shape, cp);
        };

        /**
         *
         * @param shape
         * @param x
         * @param y
         * @param z
         */
        positionIn2dSpace(shape, x, y, z) {
            let cp = new THREE.Vector3(x, y, z);
            cp.add(this.patternCenterVector(true));
            shape.position().copy(cp);
        };

        /**
         *
         * @param x
         * @param y
         * @param z
         * @returns {*|HC.Shape.rotation|number|UniformsLib.sprite.rotation|{value}|rotation}
         */
        rotation(x, y, z) {
            if (x !== undefined) {

                x *= RAD;
                y *= -RAD;
                z *= -RAD;

                this._rotation.rotation.set(x, y, z);
            }

            return this._rotation.rotation;
        };

        /**
         *
         * @param x
         * @param y
         * @param z
         */
        position(x, y, z) {
            let cdd = this.cameraDefaultDistance(.25);
            this._rotation.position.set(this.resolution('half').x + x * cdd, -this.resolution('half').y - y * cdd, z * cdd);
        };

        /**
         *
         * @param sh
         * @param fx
         * @returns {*}
         */
        shaders(sh) {

            if (sh !== undefined) {
                let composer = this.three.composer;
                composer.passes = [composer.passes[0]];

                composer.reset();

                if (sh && sh.length) {
                    let i = 0
                    for (; i < sh.length; i++) {
                        let pass = sh[i].create();
                        composer.addPass(pass);
                        pass.renderToScreen = false;
                    }

                    sh[i - 1].create().renderToScreen = true;
                }

                this._shaders = sh;

            } else {
                sh = this._shaders;
            }

            return sh;
        };

        /**
         *
         * @param depthMultiplier
         * @param reduce
         * @returns {Vector3}
         */
        random3dPosition(depthMultiplier, reduce) {
            return new THREE.Vector3(
                randomInt(0, this.resolution('half').x * this.settings.pattern_paddingx - (reduce || 0), true),
                randomInt(0, this.resolution('half').y * this.settings.pattern_paddingy - (reduce || 0), true),
                randomInt(0, this.cameraDefaultDistance(depthMultiplier || 0) * this.settings.pattern_paddingz, true)
            );
        };

        /**
         *
         * @param depthMultiplier
         * @param reduce
         * @returns {Vector3}
         */
        random2dPosition(depthMultiplier, reduce) {
            return new THREE.Vector3(
                randomInt(0, this.resolution().x),
                randomInt(0, -this.resolution().y),
                randomInt(0, this.cameraDefaultDistance(depthMultiplier || 0) * this.settings.pattern_paddingz, true)
            );
        };

        /**
         *
         * @returns {*|boolean}
         */
        getCurrentSpeed() {
            return this.beatKeeper.getSpeed(this.settings.rhythm);
        };

        /**
         *
         * @param shape
         * @returns {*}
         */
        getShapeSpeed(shape) {
            return this.getShapeRhythmPlugin().params(shape);
        };

        /**
         *
         * @param shape
         * @returns {*}
         */
        getShapeDelay(shape) {
            return this.getShapeDelayPlugin().params(shape);
        };
    }
}