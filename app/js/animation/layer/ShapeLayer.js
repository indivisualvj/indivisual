/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {_Layer} from "./SceneLayer";

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
}

export {Layer as _Layer}