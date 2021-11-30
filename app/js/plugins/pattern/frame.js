{
    HC.plugins.pattern.frame = class Plugin extends HC.PatternPlugin {
        static name = 'frame';
        shapeCountHalf = false;
        shapeCountQuarter = false;

        apply(shape) {
            let layer = this.layer;

            if (!this.shapeCountHalf || !this.shapeCountQuarter) {
                this.shapeCountHalf = Math.max(1, round(layer.shapeCount() / 2, 0));
                this.shapeCountQuarter = Math.max(1, round(layer.shapeCount() / 4, 0));
            }

            let rx = this.shapeCountQuarter;
            let ry = rx;
            let x, y, z = 0;

            let ratio = this.settings.pattern_paddingx / this.settings.pattern_paddingy;

            if (ratio < 1) {
                let u = 2 * (layer.resolution().x * this.settings.pattern_paddingx + layer.resolution().y * this.settings.pattern_paddingy);
                let prc = (layer.resolution().y * this.settings.pattern_paddingy) / u;

                ry = Math.ceil(layer.shapeCount() * prc) - 1;
                rx = this.shapeCountHalf - ry;

            } else if (ratio >= 1) {
                let u = 2 * (layer.resolution().x * this.settings.pattern_paddingx + layer.resolution().y * this.settings.pattern_paddingy);
                let prc = layer.resolution().x * this.settings.pattern_paddingx / u;

                rx = Math.ceil(layer.shapeCount() * prc);
                ry = this.shapeCountHalf - rx;
            }

            let px = this.settings.pattern_padding * this.settings.pattern_paddingx;
            let py = this.settings.pattern_padding * this.settings.pattern_paddingy;
            let w = (layer.resolution().x - layer.shapeSize(1)) * px;
            let h = (layer.resolution().y - layer.shapeSize(1)) * py;
            let gx = w / rx;
            let gy = h / ry;
            let l = w / -2;
            let t = h / -2;
            let i = shape.index;

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

            this.positionIn3dSpace(shape, x, y, z);
        }
    }
}