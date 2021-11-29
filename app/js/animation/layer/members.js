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
        }

        /**
         *
         * @param x
         * @param y
         * @param z
         */
        position(x, y, z) {
            let cdd = this.cameraDefaultDistance(.25);
            this._rotation.position.set(this.resolution('half').x + x * cdd, -this.resolution('half').y - y * cdd, z * cdd);
        }

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
        }

        /**
         *
         * @returns {*|boolean}
         */
        currentSpeed() {
            return this.beatKeeper.getSpeed(this.settings.rhythm);
        }

    }
}