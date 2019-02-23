HC.plugins.pattern = HC.plugins.pattern || {};
{
    HC.PatternPlugin = class Plugin extends HC.AnimationPlugin {

        sharedMoverParams(ox, oy, gapx, gapy) { // essential for panning torching bouncing pattern_mover
            if (arguments.length == 4) {
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

            var direction = new THREE.Vector3(0, 0, 0);
            if (true) {//beatkeeper.getSpeed('sixteen').prc == 0) {

                // bounds check
                var mx = this.layer.resolution('half').x + (extend || 0);
                var my = this.layer.resolution('half').y + (extend || 0);
                var mz = this.layer.cameraDefaultDistance(depthMultiplier || 0);

                var world = new THREE.Vector3();
                shape.getWorldPosition(world);

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
            }

            return direction;
        }
    }
}
