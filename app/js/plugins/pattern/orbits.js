HC.plugins.pattern.orbits = _class(false, HC.PatternPlugin, {
    name: 'orbits',
    injections: {},

    apply(shape) {
        var layer = this.layer;


        var params = this.params(shape);

        var firstRun = false;
        if (!params.groundSpeed) {
            firstRun = true;
            params.groundSpeed = randomFloat(0.2, 1, 2);
            params.startAngle = params.groundAngle = randomInt(0, 360, false);

            if (this.settings.pattern_sync) {
                var _lcsc = 0;
                params.shellIndex = 0;
                for (var si = 1; si <= 4; si++) {
                    var csc = 2 * si * si;
                    if (shape.index < csc && shape.index >= _lcsc) {
                        params.shellIndex = si;
                        break;
                    }
                    _lcsc = csc;
                }
            } else {
                params.shellIndex = randomFloat(1, 4, 2);
            }
        }

        var shell = params.shellIndex;
        var p = this.settings.pattern_padding;
        var px = this.settings.pattern_paddingx;
        var py = this.settings.pattern_paddingy;
        var pz = this.settings.pattern_paddingz;

        var shellDiamenter = layer.resolution('half').length() / 4;
        var radius = shellDiamenter * shell * p;
        var maxX = radius * px;
        var maxY = radius * py;
        var maxZ = radius * pz;

        var speed = params.groundSpeed * 0.05 * shape.size();
        if (this.settings.pattern_limit && !firstRun) {
            var position = shape.position();

            var distance = position.distanceTo(patternCenterVector);
            speed = shape.size() / distance * 25;
        }

        params.groundAngle += speed * animation.diff;
        if (params.groundAngle - params.startAngle > 360) {
            params.groundAngle -= 360;
        }

        var radiants = params.groundAngle * RAD;

        var x = Math.sin(radiants);
        var y = Math.cos(radiants);
        var z = Math.cos(radiants + params.startAngle * RAD);

        x = x * maxX;
        y = y * maxY;
        z = z * maxZ;

        layer.positionIn3dSpace(shape, x, y, z);
    }
});