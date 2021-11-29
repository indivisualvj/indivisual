/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.Layer = class Layer extends HC.Layer {

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
                    hsl = HC.hslComplementary(hsl);
                }
                hex = HC.hslToHex(hsl);
            }
            return hex;
        };

        getShape(index) {
            if (index in this.shapes) {
                return this.shapes[index];
            }

            return null;
        };

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
        };

        /**
         *
         * @returns {number}
         */
        shapeCount() {
            return this.settings.pattern_shapes;
        };

        /**
         *
         * @param child
         */
        addShape(child) {
            child.parent = this;
            this._shapes.add(child.sceneObject());
        };

        /**
         *
         * @returns {*}
         */
        getRandomShape() {
            return this.getShape(randomInt(0, this.shapes.length - 1));
        };

    }
}