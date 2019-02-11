HC.plugins.pattern.frame = _class(
    function () {
        this.shapeCountHalf = false;
        this.shapeCountQuarter = false;
    }, HC.PatternPlugin, {
        name: 'frame',
        apply: function (shape) {
            var layer = this.layer;

            if (!this.shapeCountHalf || !this.shapeCountQuarter) {
                this.shapeCountHalf = Math.max(1, round(layer.shapeCount() / 2, 0));
                this.shapeCountQuarter = Math.max(1, round(layer.shapeCount() / 4, 0));
            }

            var rx = this.shapeCountQuarter;
            var ry = rx;
            var x, y, z = 0;

            var ratio = this.settings.pattern_paddingx / this.settings.pattern_paddingy;

            if (ratio < 1) {
                var u = 2 * (layer.resolution().x * this.settings.pattern_paddingx + layer.resolution().y * this.settings.pattern_paddingy);
                var prc = (layer.resolution().y * this.settings.pattern_paddingy) / u;

                ry = Math.ceil(layer.shapeCount() * prc) - 1;
                rx = this.shapeCountHalf - ry;

            } else if (ratio >= 1) {
                var u = 2 * (layer.resolution().x * this.settings.pattern_paddingx + layer.resolution().y * this.settings.pattern_paddingy);
                var prc = layer.resolution().x * this.settings.pattern_paddingx / u;

                rx = Math.ceil(layer.shapeCount() * prc);
                ry = this.shapeCountHalf - rx;
            }

            var px = this.settings.pattern_padding * this.settings.pattern_paddingx;
            var py = this.settings.pattern_padding * this.settings.pattern_paddingy;
            var w = (layer.resolution().x - layer.shapeSize(1)) * px;
            var h = (layer.resolution().y - layer.shapeSize(1)) * py;
            var gx = w / rx;
            var gy = h / ry;
            var l = w / -2;
            var t = h / -2;
            var i = shape.index;

            if (i < rx) {
                x = (l + i * gx);
                y = (t);

            } else if (i < rx + ry) {
                i -= rx;
                x = (l + w);
                y = (t + i * gy);

            } else if (i < rx + ry + rx) {
                i -= rx + ry;
                x = (l + w - i * gx);
                y = (t + h);

            } else {
                i -= rx + ry + rx;
                x = (l);
                y = (t + h - i * gy);
            }

            layer.positionIn3dSpace(shape, x, y, z);
        }
    }
);