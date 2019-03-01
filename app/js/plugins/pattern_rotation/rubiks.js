{
    HC.plugins.pattern_rotation.rubiks = class Plugin extends HC.PatternRotationPlugin {
        rubiks = false;
        slice = false;
        axes = ['x', 'y', 'z'];
        vector = new THREE.Vector3(1, 1, 1);
        shared = {
            locking: {
                disabled: true
            }
        };

        apply() {
            if (!this.rubiks) {
                var plugin = this.layer.getPatternPlugin('cube');
                var spd = plugin.shapesPerDimension();
                this.rubiks = spd;

            }

            if (beatkeeper.getSpeed(this.settings.rhythm).prc == 0) {
                this.slice = {
                    index: randomInt(0, this.rubiks - 1),
                    axis: this.axes[randomInt(0, this.axes.length - 1)]
                };
            }
        }

        positionIn3dSpace(shape, cp) {
            var eu = this.getShapeEuler(shape);
            cp.applyEuler(eu);
            cp.add(this.layer.patternCenterVector(true));
            shape.position().copy(cp);
        }

        getShapeEuler(shape) {
            var plugin = this.layer.getPatternPlugin('cube');
            var grid = plugin.cubePosition(shape);
            var eu = new THREE.Euler();

            var slice = this.slice.index;
            var axis = this.slice.axis;
            switch (axis) {
                case 'x':
                    if (grid.x == slice) {
                        eu.x = this.euler.x;
                    }
                    break;
                case 'y':
                    if (grid.y == slice) {
                        eu.y = this.euler.y;
                    }
                    break;
                case 'z':
                    if (grid.z == slice) {
                        eu.z = this.euler.z;
                    }
                    break;
            }

            return eu;
        }
    }
}