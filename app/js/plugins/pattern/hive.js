{
    HC.plugins.pattern.hive = class Plugin extends HC.PatternPlugin {
        static name = 'hive (hexagon)';

        apply(shape) {
            let layer = this.layer;
            let matrix = layer.getPatternPlugin('matrix');
            let gridPosition = matrix.gridPosition(shape);
            let gpadx = this.settings.pattern_paddingx * .867;
            let gpady = this.settings.pattern_paddingy * .75;
            let gapx = layer.shapeSize(1) * gpadx;
            let gapy = layer.shapeSize(1) * gpady;

            gapx *= this.settings.pattern_padding;
            gapy *= this.settings.pattern_padding;

            let ox = (-gapx * matrix.columnCount(layer)) / 2;
            let oy = (-gapy * matrix.rowCount(layer)) / 2;

            let gapxs = gapx / 2;
            let gapys = gapy / 2;

            if (gridPosition.y % 2 === 0) {
                gapxs -= gapx/2;
            }

            let x = ox + gridPosition.x * gapx - gapxs;
            let y = oy + gridPosition.y * gapy - gapys;
            let z = 0;

            this.positionIn3dSpace(shape, x, -y, z);

            this.sharedMoverParams(ox, oy, gapx, gapy);
        }
    }
}
{
    HC.plugins.pattern.trihive = class Plugin extends HC.PatternPlugin {
        static name = 'hive (triangle)';

        injections = {
            center: null,
        }

        apply(shape) {
            let params = this.params(shape);
            if (!params.center) {
                shape.geometry.computeBoundingSphere();
                params.center = shape.geometry.boundingSphere.center;
            }
            let layer = this.layer;
            let matrix = layer.getPatternPlugin('matrix');
            let gridPosition = matrix.gridPosition(shape);
            let gpadx = this.settings.pattern_paddingx * .4343;
            let gpady = this.settings.pattern_paddingy * .751;
            let gpad = this.settings.pattern_padding;

            let gapx = layer.shapeSize(1) * gpadx;
            let gapy = layer.shapeSize(1) * gpady;

            gapx *= gpad;
            gapy *= gpad;

            let ox = (-gapx * matrix.columnCount(layer)) / 2;
            let oy = (-gapy * matrix.rowCount(layer)) / 2;

            let gapxs = gapx / 2;
            let gapys = gapy / 2;

            let diff = -params.center.y * shape.size();

            if (gridPosition.y % 2 === 1) {
                if (gridPosition.x % 2 === 0) {
                    gapys += diff;
                } else {
                    gapys -= diff;
                }
            } else {
                if (gridPosition.x % 2 === 0) {
                    gapys -= diff;
                } else {
                    gapys += diff;
                }
            }

            let x = ox + gridPosition.x * gapx - gapxs;
            let y = oy + gridPosition.y * gapy - gapys;
            let z = 0;

            this.positionIn3dSpace(shape, x, -y, z);

            this.sharedMoverParams(ox, oy, gapx, gapy);
        }
    }
}
{
    HC.plugins.pattern.ruehive = class Plugin extends HC.PatternPlugin {
        static name = 'hive (rue)';

        apply(shape) {
            let layer = this.layer;
            let matrix = layer.getPatternPlugin('matrix');
            let gridPosition = matrix.gridPosition(shape);
            let gapx = layer.shapeSize(1) * this.settings.pattern_paddingx;
            let gapy = layer.shapeSize(1) * this.settings.pattern_paddingy / 2;

            gapx *= this.settings.pattern_padding;
            gapy *= this.settings.pattern_padding;

            let ox = (-gapx * matrix.columnCount(layer)) / 2;
            let oy = (-gapy * matrix.rowCount(layer)) / 2;

            let gapxs = gapx / 2;
            let gapys = gapy / 2;

            if (gridPosition.y % 2 === 0) {
                gapxs -= gapx/4;
            } else {
                gapxs += gapx/4;
            }

            let x = ox + gridPosition.x * gapx - gapxs;
            let y = oy + gridPosition.y * gapy - gapys;
            let z = 0;

            this.positionIn3dSpace(shape, x, -y, z);

            this.sharedMoverParams(ox, oy, gapx, gapy);
        }
    }
}