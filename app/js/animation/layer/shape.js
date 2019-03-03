/**
 *
 * @param random
 * @param complementary
 * @returns {number|*|string}
 */
HC.Layer.prototype.shapeColor = function (random, complementary) {

    var hex = '';
    var index = Math.floor(this.shapes.length / 2);
    var map = this.getMaterialMap();
    if (map && map.image && map.image._color) {
        hex = map.image._color;

    } else if (this.shapes.length) {

        if (random) {
            index = randomInt(0, this.shapes.length - 1);
        }

        var shape = this.shapes[index];
        var hsl = shape.color;
        if (complementary) {
            hsl = hslComplementary(hsl);
        }
        hex = hslToHex(hsl);
    }
    return hex;
};

/**
 *
 * @param multiplier
 * @returns {number}
 */
HC.Layer.prototype.shapeSize = function (multiplier) {

    /**
     * todo cacklösung weil da die zahl der teilungen steht.
     * da müsste 14 eigentlich 64-14 also 50 sein. max - shape_sizedivider wären also 14 und man hätte den divider.
     * alle presets ändern und det so machen
     */
    if (this._shapeSize != this.settings.shape_sizedivider) {
        this._shapeSize = this.settings.shape_sizedivider;
        var preset = this.resolution().x / this._shapeSize;
        this._shapeSizePixels = preset;
    }
    return this._shapeSizePixels * (multiplier || 1);
};

/**
 *
 * @returns {number}
 */
HC.Layer.prototype.shapeCount = function () {
    return this.settings.pattern_shapes;
};

/**
 *
 * @param child
 */
HC.Layer.prototype.addShape = function (child) {
    child._layer = this;
    this._shapes.add(child.sceneObject());
};

/**
 *
 * @returns {*}
 */
HC.Layer.prototype.getRandomShape = function () {
    return this.shapes[randomInt(0, this.shapes.length - 1)];
};