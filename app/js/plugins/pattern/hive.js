{
    HC.plugins.pattern.hive = class Plugin extends HC.PatternPlugin {
        static name = 'hive';

        apply(shape) {
            let layer = this.layer;
            let gapx = layer.shapeSize(1) * 0.745 * this.settings.pattern_paddingx;
            let nh = layer.shapeSize(1) * 0.86 * this.settings.pattern_paddingy;
            let gapy = nh;
            let matrix = layer.getPatternPlugin('matrix');
            let gridPosition = matrix.gridPosition(shape);

            gapx *= this.settings.pattern_padding;
            gapy *= this.settings.pattern_padding;

            let ox = (-gapx * matrix.columnCount(layer)) / 2;
            let oy = (-gapy * matrix.rowCount(layer)) / 2;

            if (gridPosition.y % 2 === 0) {
                if (shape.index % 2 === 0) {
                    oy -= nh / 2 * this.settings.pattern_padding * this.settings.pattern_paddingx;
                }

            } else {
                if (shape.index % 2 === 1) {
                    oy -= nh / 2 * this.settings.pattern_padding * this.settings.pattern_paddingy;
                }
            }

            let x = ox + gridPosition.x * gapx - gapx / 2;
            let y = oy + gridPosition.y * gapy - gapy / 4;
            let z = 0;

            layer.positionIn3dSpace(shape, x, -y, z);

            this.sharedMoverParams(ox, oy, gapx, gapy);
        }
    }
}
{
    HC.plugins.pattern.trihive = class Plugin extends HC.PatternPlugin {
        static name = 'trihive';

        apply(shape) {
            let layer = this.layer;

            let matrix = layer.getPatternPlugin('matrix');
            let gridPosition = matrix.gridPosition(shape);
            let size = layer.shapeSize(1);
            let gapx = size * 0.43 * this.settings.pattern_paddingx;
            let gapy = size * 0.748 * this.settings.pattern_paddingy;

            gapx *= this.settings.pattern_padding;
            gapy *= this.settings.pattern_padding;

            let ox = (-gapx * matrix.columnCount(layer)) / 2;
            let oy = (-gapy * matrix.rowCount(layer)) / 2;

            if (shape.index % 2 === 1) {
                oy -= layer.shapeSize(.5) * 0.5 * this.settings.pattern_padding * this.settings.pattern_paddingx;
            }

            let x = ox + gridPosition.x * gapx - gapx / 2;
            let y = oy + gridPosition.y * gapy - gapy / 4;
            let z = 0;

            layer.positionIn3dSpace(shape, x, -y, z);

            this.sharedMoverParams(ox, oy, gapx, gapy);
        }
    }
}
{
    HC.plugins.pattern.ruehive = class Plugin extends HC.PatternPlugin {
        static name = 'ruehive';

        apply(shape) {
            let layer = this.layer;
            let matrix = layer.getPatternPlugin('matrix');
            let gridPosition = matrix.gridPosition(shape);
            let gapx = layer.shapeSize(1) * this.settings.pattern_paddingx;
            let gapy = 0.5 * layer.shapeSize(1) * this.settings.pattern_paddingy;

            gapx *= this.settings.pattern_padding;
            gapy *= this.settings.pattern_padding;

            let ox = -gapx * matrix.columnCount(layer) / 2;
            let oy = -gapy * matrix.rowCount(layer) / 2;

            if (gridPosition.y % 2 === 1) {
                ox -= layer.shapeSize(.5);
            }

            let x = ox + gridPosition.x * gapx - gapx / 2;
            let y = oy + gridPosition.y * gapy - gapy / 2;
            let z = 0;

            layer.positionIn3dSpace(shape, x, -y, z);

            this.sharedMoverParams(ox, oy, gapx, gapy);
        }
    }
}