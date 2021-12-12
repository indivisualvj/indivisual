/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {_Layer} from "./PluginLayer";

class Layer extends _Layer
{

    /**
     *
     * @param random
     * @param complementary
     * @returns {string}
     */
    shapeColor(random, complementary) {

        let hex = '';
        let index = Math.floor(this.shapes.length / 2);
        let plugin = this.getOverrideMaterialInput();
        if (plugin.map && plugin.map.image && plugin.map.image._color) {
            hex = plugin.map.image._color;

        } else if (this.shapes.length) {

            if (random) {
                index = randomInt(0, this.shapes.length - 1);
            }

            let shape = this.getShape(index);
            let hsl = shape.color;
            if (complementary) {
                hsl = hslComplementary(hsl);
            }
            hex = hslToHex(hsl);
        }
        return hex;
    }

    /**
     *
     * @param index
     * @return {null|Shape}
     */
    getShape(index) {
        if (index in this.shapes) {
            return this.shapes[index];
        }

        return null;
    }

    /**
     *
     * @param multiplier
     * @returns {number}
     */
    shapeSize(multiplier) {
        if (this._shapeSize !== this.settings.shape_sizedivider) {
            this._shapeSize = this.settings.shape_sizedivider;
            this._shapeSizePixels = this.resolution().x / this._shapeSize;
        }
        return this._shapeSizePixels * (multiplier || 1);
    }

    /**
     *
     * @returns {number}
     */
    shapeCount() {
        return this.settings.pattern_shapes;
    }

    /**
     *
     * @param child
     */
    addShape(child) {
        child.parent = this;
        this._shapes.add(child.sceneObject());
    }

    /**
     *
     * @returns {*}
     */
    randomShape() {
        return this.getShape(randomInt(0, this.shapeCount() - 1));
    }


    /**
     *
     * @param shape
     * @returns {*}
     */
    shapeSpeed(shape) {
        return this.getShapeRhythmPlugin().params(shape);
    }

    /**
     *
     * @param shape
     * @returns {*}
     */
    shapeDelay(shape) {
        return this.shapeDelayPlugin().params(shape);
    }


    /**
     *
     * @param x
     * @param y
     * @param z
     * @return {*}
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

export {Layer}