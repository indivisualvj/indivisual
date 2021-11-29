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
                let plugin = this.layer.getPatternPlugin('cube');
                this.rubiks = plugin.shapesPerDimension();

            }

            if (this.beatKeeper.getSpeed(this.controlSets['audio'].get('rhythm')).prc === 0) {
                this.slice = {
                    index: randomInt(0, this.rubiks - 1),
                    axis: this.axes[randomInt(0, this.axes.length - 1)]
                };
            }
        }

        positionIn3dSpace(shape, cp) {
            let eu = this.getShapeEuler(shape);
            cp.applyEuler(eu);
            cp.add(this.layer.getPatternPlugin().patternCenterVector(true));
            shape.position().copy(cp);
        }

        getShapeEuler(shape) {
            let plugin = this.layer.getPatternPlugin('cube');
            let grid = plugin.cubePosition(shape);
            let eu = new THREE.Euler();

            let slice = this.slice.index;
            let axis = this.slice.axis;
            switch (axis) {
                case 'x':
                    if (grid.x === slice) {
                        eu.x = this.euler.x;
                    }
                    break;
                case 'y':
                    if (grid.y === slice) {
                        eu.y = this.euler.y;
                    }
                    break;
                case 'z':
                    if (grid.z === slice) {
                        eu.z = this.euler.z;
                    }
                    break;
            }

            return eu;
        }
    }
}
