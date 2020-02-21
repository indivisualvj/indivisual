HC.plugins.pattern = HC.plugins.pattern || {};
{
    HC.PatternPlugin = class Plugin extends HC.AnimationPlugin {

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.pattern.properties;
        }

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

            let direction = new THREE.Vector3(0, 0, 0);
            // todo bounds check using box/geometry (layer.playground (settings?[layer_playground_volume/size])
            //  place it shortly behind camera
            //  example: https://threejs.org/examples/?q=webx#webxr_vr_multiview

            // bounds _check
            let mx = this.layer.resolution('half').x + (extend || 0);
            let my = this.layer.resolution('half').y + (extend || 0);
            let mz = this.layer.cameraDefaultDistance(depthMultiplier || 0);

            let world = new THREE.Vector3();
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

            return direction;
        }
    }
}
