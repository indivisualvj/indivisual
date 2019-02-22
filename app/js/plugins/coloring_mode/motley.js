HC.plugins.coloring_mode.motley = _class(false, HC.ColoringModePlugin, {
    name: 'motley',
    index: 2,
    injections: {
        velocity: false
    },
    apply: function (shape, minL, maxL) {

        var params = this.params(shape);
        if (!params.velocity) {
            let min = 1;
            let max = 3;
            params.velocity = new THREE.Vector3(
                randomFloat(min, max, 2, true),
                randomFloat(min, max, 2, true),
                randomFloat(min, max, 2, true)
            );
        }

        var color = shape.color;

        var minS = 60;
        var maxS = 100;

        minL = minL || 30;
        maxL = maxL || 60;

        // Hue
        color.h += params.velocity.x * animation.diffPrc / 2 * this.settings.coloring_volume;
        color.h %= 360;

        // Saturation
        color.s += params.velocity.y * animation.diffPrc / 5;
        if (color.s < minS || color.s > maxS) {
            params.velocity.y *= -1;
            color.s = clamp(color.s, minS, maxS);
        }

        // Luminance
        color.l += params.velocity.z * animation.diffPrc / 5;
        if (color.l < minL || color.l > maxL) {
            params.velocity.z *= -1;
            color.l = clamp(color.l, minL, maxL);
        }
    }
});

HC.plugins.coloring_mode.one = _class(false, HC.ColoringModePlugin, {
    name: 'one',
    index: 1,
    apply: function (shape) {

        if (this.isFirstShape(shape)) {
            this.color = shape.color;

            this.layer.getColoringModePlugin('motley').apply(shape, 40, 60);

        } else if (this.color) {
            shape.color.h = this.color.h;
            shape.color.s = this.color.s;
            shape.color.l = this.color.l;
        }
    },

    after: function (shape) {
        var l = shape.color.l;
        HC.ColoringModePlugin.prototype.after.call(this, shape);
        if (!this.isFirstShape(shape)) {
            shape.color.l = l;
        }
    }
});