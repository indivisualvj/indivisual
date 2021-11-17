/**
 *
 * @param random
 * @param complementary
 * @returns {string}
 */
HC.Layer.prototype.shapeColor = function (random, complementary) {

    let hex = '';
    let index = Math.floor(this.shapes.length / 2);
    let plugin = this.getMaterialMap();
    if (plugin.map && plugin.map.image && plugin.map.image._color) {
        hex = plugin.map.image._color;

    } else if (this.shapes.length) {

        if (random) {
            index = randomInt(0, this.shapes.length - 1);
        }

        let shape = this.shapes[index];
        let hsl = shape.color;
        if (complementary) {
            hsl = hslComplementary(hsl);
        }
        hex = hslToHex(hsl);
    }
    return hex;
};

// todo use everywere???
HC.Layer.prototype.getShape = function (index) {
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
HC.Layer.prototype.shapeSize = function (multiplier) {

    /**
     * da müsste 14 eigentlich 64-14 also 50 sein. max - shape_sizedivider wären also 14 und man hätte den divider.
     * alle presets ändern und det so machen
     */
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
HC.Layer.prototype.shapeCount = function () {
    return this.settings.pattern_shapes;
};

/**
 *
 * @param child
 */
HC.Layer.prototype.addShape = function (child) {
    child.parent = this;
    this._shapes.add(child.sceneObject());
};

/**
 *
 * @returns {*}
 */
HC.Layer.prototype.getRandomShape = function () {
    return this.shapes[randomInt(0, this.shapes.length - 1)];
};
