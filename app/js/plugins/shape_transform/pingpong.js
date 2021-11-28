{
    HC.plugins.shape_transform.pingpong = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'pingpong';

        explode = 0;

        apply(shape) {

            let min = shape.geometry.boundingBox.min.clone();
            let max = shape.geometry.boundingBox.max.clone();

            let multiplier = this.settings.shape_transform_volume * (this.explode ? 2 : 1);

            if (this.explode > 0) {
                min.multiplyScalar(1.5 * this.settings.shape_transform_volume);
                max.multiplyScalar(1.5 * this.settings.shape_transform_volume);

                this.explode -= this.animation.diff;

            } else if (this.isExplosion()) {
                this.explode = .75 * this.layer.getCurrentSpeed().duration;
            }

            let vertices = shape.geometry.getAttribute('position');
            let speeds = this.vertices;

            let vtc = new THREE.Vector3();
            for (let i = 0; i < vertices.count; i++) {
                let speed = speeds[i];
                vtc.fromBufferAttribute(vertices, i);
                
                this.setSpeeds(speed, vtc);

                vtc.x += this.animation.diffPrc * speed.x * multiplier;
                vtc.y += this.animation.diffPrc * speed.y * multiplier;
                vtc.z += this.animation.diffPrc * speed.z * multiplier;

                this.fixBounds(min, max, speed, vtc);
                this.clampSpeed(speed);
                
                vertices.setXYZ(i,
                    vtc.x,
                    vtc.y,
                    vtc.z
                );
            }
        }

        isExplosion() {
            return !this.settings.shape_sync && (this.audioAnalyser.peak || this.layer.getCurrentSpeed().starting()) && randomBool(3);
        }

        clampSpeed(speed) {
            let limit = 5;
            speed.x = clamp(speed.x, -limit * this.settings.shape_transform_volume, limit * this.settings.shape_transform_volume);
            speed.y = clamp(speed.y, -limit * this.settings.shape_transform_volume, limit * this.settings.shape_transform_volume);
            speed.z = clamp(speed.z, -limit * this.settings.shape_transform_volume, limit * this.settings.shape_transform_volume);
        }

        /**
         * @param {THREE.Vector3} min
         * @param {THREE.Vector3} max
         * @param {THREE.Vector3} speed
         * @param {THREE.Vector3} vtc
         */
        fixBounds(min, max, speed, vtc) {

            if (vtc.x > max.x) {
                // vtc.x = max.x;
                speed.x = -this.randomTurn(speed.x);
            }
            if (vtc.x < min.x) {
                // vtc.x = min.x;
                speed.x = this.randomTurn(speed.x);
            }
            if (vtc.y > max.y) {
                // vtc.y = max.y;
                speed.y = -this.randomTurn(speed.y);
            }
            if (vtc.y < min.y) {
                // vtc.y = min.y;
                speed.y = this.randomTurn(speed.y);
            }
            if (vtc.z > max.z) {
                // vtc.z = max.z;
                speed.z = -this.randomTurn(speed.z);
            }
            if (vtc.z < min.z) {
                // vtc.z = min.z;
                speed.z = this.randomTurn(speed.z);
            }
        }

        /**
         * @param {THREE.Vector3} speed
         * @param {THREE.Vector3} reference
         */
        setSpeeds(speed, reference) {
            if (speed.x === reference.x) {
                speed.x = this.randomSpeed();
            }
            if (speed.y === reference.y) {
                speed.y = this.randomSpeed();
            }
            if (speed.z === reference.z) {
                speed.z = this.randomSpeed();
            }
        }

        /**
         *
         * @param {number}value
         * @returns {number}
         */
        randomTurn(value) {
            return Math.abs(value * randomFloat(.9, 1.1, 3));
        }

        /**
         *
         * @returns {number}
         */
        randomSpeed() {
            return this.layer.shapeSize(.001) * randomFloat(1, 8, 3, true);
        }
    }
}