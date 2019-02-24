HC.plugins.pattern_mover.bounce = _class(
    function () {
        this.mover = {
            x: 0,
            y: 0
        };
    }, HC.PatternMoverPlugin, {
        name: 'bounce h',
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

                var speed = layer.getCurrentSpeed();
                jump *= animation.diffPrc * (layer.shapeSize(1) * shape.size() * speed.prc) / 4;

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

HC.plugins.pattern_mover.bouncev = _class(false, HC.PatternMoverPlugin, {
    name: 'bounce v',
    apply: function (shape) {
        var layer = this.layer;
        layer.getPatternMoverPlugin('bounce').apply(shape, true);
    }
});

HC.plugins.pattern_mover.bouncer = _class(
    function () {
        this.dir = false;
    }, HC.PatternMoverPlugin, {
        name: 'bounce h|v',
        apply: function (shape) {
            var layer = this.layer;
            var speed = this.layer.getShapeSpeed(shape);
            if (this.isFirstShape(shape) && speed.prc == 0) {
                this.dir = randomBool();
            }
            if (this.dir) {
                layer.getPatternMoverPlugin('bounce').apply(shape, false);
            } else {
                layer.getPatternMoverPlugin('bounce').apply(shape, true);
            }
        }
    }
);