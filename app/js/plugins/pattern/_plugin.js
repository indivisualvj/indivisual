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

        /**
         *
         * @returns {number}
         */
        patternCenterX() {
            return this.layer.resolution('half').x + this.layer.cameraDefaultDistance(.25) * this.settings.pattern_centerx;
        }

        /**
         *
         * @returns {number}
         */
        patternCenterY() {
            return this.layer.resolution('half').y + this.layer.cameraDefaultDistance(.25) * this.settings.pattern_centery;
        }

        /**
         *
         * @returns {number}
         */
        patternCenterZ() {
            return this.layer.cameraDefaultDistance(.25) * this.settings.pattern_centerz;
        }

        /**
         *
         * @param invertY
         * @returns {Vector3}
         */
        patternCenterVector(invertY) {
            return new THREE.Vector3(this.patternCenterX(), this.patternCenterY() * (invertY ? -1 : 1), this.patternCenterZ());
        }

        /**
         *
         * @param shape
         * @param x
         * @param y
         * @param z
         */
        positionIn3dSpace(shape, x, y, z) {
            let cp = new THREE.Vector3(x, y, z);
            let plugin = this.layer.getPatternRotationPlugin();
            plugin.positionIn3dSpace(shape, cp);
        }

        /**
         *
         * @param shape
         * @param x
         * @param y
         * @param z
         */
        positionIn2dSpace(shape, x, y, z) {
            let cp = new THREE.Vector3(x, y, z);
            cp.add(this.getPatternPlugin().patternCenterVector(true));
            shape.position().copy(cp);
        }


        /**
         *
         * @param depthMultiplier
         * @param reduce
         * @returns {Vector3}
         */
        random3dPosition(depthMultiplier, reduce) {
            return new THREE.Vector3(
                randomInt(0, this.layer.resolution('half').x * this.settings.pattern_paddingx - (reduce || 0), true),
                randomInt(0, this.layer.resolution('half').y * this.settings.pattern_paddingy - (reduce || 0), true),
                randomInt(0, this.layer.cameraDefaultDistance(depthMultiplier || 0) * this.settings.pattern_paddingz, true)
            );
        }

        /**
         *
         * @param shape
         * @param extend
         * @param depthMultiplier
         * @param velocity
         * @returns {Vector3}
         */
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

            // bounds check

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
