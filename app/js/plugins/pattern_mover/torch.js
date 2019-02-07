HC.plugins.pattern_mover.torch = _class(
    function () {
        this.mover = {
            x: 0,
            y: 0,
            a: 0
        };
    }, HC.PatternMoverPlugin, {
        name: 'torch',
        injections: {
            panmox: 0,
            panmoy: 0,
            panhox: 0,
            panhoy: 0
        },

        apply: function (shape) {
            var layer = this.layer;

            var patternPlugin = layer.getPatternPlugin();
            var shared = patternPlugin.sharedMoverParams();

            var gapx = shared.gap.x;
            var gapy = shared.gap.y;
            var ox = shared.offset.x;
            var oy = shared.offset.y;

            if (this.isFirstShape(shape)) {
                var jump = 0.1 * animation.diff * this.settings.pattern_padding;
                this.mover.a += randomInt(-10, 10);
                var a = 90 + this.mover.a * 0.98;
                var x = Math.sin(a * RAD) * jump;
                var y = Math.cos(a * RAD) * jump;

                this.mover.x += x;
                this.mover.y += y;
            }

            var pos = shape.position().clone();
            pos.sub(layer.patternCenterVector());
            var x = pos.x;
            var y = pos.y;
            var z = pos.z;
            var px = this.mover.x;
            var py = this.mover.y;

            var params = this.params(shape);
            var matrix = layer.getPatternPlugin('matrix');
            var spanx = matrix.columnCount(layer) * gapx;

            if (px + x + params.panmox > ox + spanx) {
                params.panmox -= spanx;
            }
            if (px + x + params.panmox < ox) {
                params.panmox += spanx;
            }

            x += px + params.panmox;

            var spany = matrix.rowCount(layer) * gapy;

            if (py + y + params.panmoy > oy + spany) {
                params.panmoy -= spany;
            }
            if (py + y + params.panmoy < oy) {
                params.panmoy += spany;
            }

            y += py + params.panmoy;

            layer.positionIn3dSpace(shape, x, y, z);
        }
    }
);
