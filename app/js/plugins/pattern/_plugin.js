HC.plugins.pattern = HC.plugins.pattern || {};
{
    HC.PatternPlugin = class Plugin extends HC.AnimationPlugin {

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.pattern.properties;
        }

        sharedMoverParams(ox, oy, gapx, gapy) { // essential for panning torching bouncing pattern_mover
            if (arguments.length === 4) {
                this.shared = {
                    gap: {
                        x: gapx,
                        y: gapy
                    },
                    offset: {
                        x: ox,
                        y: oy
                    }
                };
            } else if (!this.shared) {
                return this.sharedMoverParams(0, 0, 0, 0);
            }

            return this.shared;
        }

        boundsCheck(shape, extend, depthMultiplier, velocity) {

            let direction = new THREE.Vector3(0, 0, 0);

            // source: https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
            const visibleHeightAtZDepth = ( depth, camera ) => {
                // compensate for cameras not positioned at z=0
                const cameraOffset = camera.position.z;
                if ( depth < cameraOffset ) depth -= cameraOffset;
                else depth += cameraOffset;

                // vertical fov in radians
                const vFOV = camera.fov * Math.PI / 180;

                // Math.abs to ensure the result is always positive
                return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
            };

            const visibleWidthAtZDepth = ( depth, camera ) => {
                const height = visibleHeightAtZDepth( depth, camera );
                return height * camera.aspect;
            };

            // bounds _check

            let world = new THREE.Vector3();
            shape.getWorldPosition(world);

            let mx = visibleWidthAtZDepth(world.z, this.layer.getCamera()) / 2;
            let my = visibleHeightAtZDepth(world.z, this.layer.getCamera()) / 2;
            let mz = this.layer.cameraDefaultDistance(depthMultiplier || 0);

            if (world.x > mx) {
                direction.x = -1;

            } else if (world.x < -mx) {
                direction.x = 1;
            }
            if (world.y > my) {
                direction.y = -1;

            } else if (world.y < -my) {
                direction.y = 1;
            }
            if (world.z > mz) {
                direction.z = -1;

            } else if (world.z < -mz) {
                direction.z = 1;
            }

            if (velocity && direction.length()) {
                velocity.x = Math.abs(velocity.x);
                velocity.y = Math.abs(velocity.y);
                velocity.z = Math.abs(velocity.z);

                velocity.multiply(direction);
            }

            return direction;
        }

        reset() {
            HC.traverse(this);
        }
    }
}
