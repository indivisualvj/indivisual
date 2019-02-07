HC.plugins.pattern_mover.pan = _class(
    function () {
        this.mover = {
            x: 0,
            y: 0
        };
    }, HC.PatternMoverPlugin, {
        name: 'pan h',
        injections: {
            panmox: 0,
            panmoy: 0,
            panhox: 0,
            panhoy: 0
        },

        apply: function (shape, vertical) {
            var layer = this.layer;

            var patternPlugin = layer.getPatternPlugin();
            var shared = patternPlugin.sharedMoverParams();

            var gapx = shared.gap.x;
            var gapy = shared.gap.y;
            var ox = shared.offset.x;
            var oy = shared.offset.y;

            if (this.isFirstShape(shape)) {
                var shapeDir = layer.getShapeDirection(shape);
                var jump = this.settings.pattern_padding * shapeDir;

                jump *= (0.1 * animation.diff);

                if (vertical) {
                    this.mover.y += jump;

                } else {
                    this.mover.x += jump;
                }
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

HC.plugins.pattern_mover.panv = _class(false, HC.PatternMoverPlugin, {
    name: 'pan v',
    apply: function (shape) {
        var layer = this.layer;
        layer.getPatternMoverPlugin('pan').apply(shape, true);
    }
});

HC.plugins.pattern_mover.panr = _class(
    function () {
        this.dir = false;
    }, HC.PatternMoverPlugin, {
        name: 'pan h|v',
        apply: function (shape) {
            var layer = this.layer;
            var speed = this.layer.getShapeSpeed(shape);
            if (this.isFirstShape(shape) && speed.prc == 0) {
                this.dir = randomBool();
            }
            if (this.dir) {
                layer.getPatternMoverPlugin('pan').apply(shape, false);
            } else {
                layer.getPatternMoverPlugin('pan').apply(shape, true);
            }
        }
    }
);