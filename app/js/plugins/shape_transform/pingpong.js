{
    HC.plugins.shape_transform.pingpong = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'pingpong';

        explode = 0;

        apply(shape) {

            let box = shape.geometry.boundingBox;
            let multiplier = this.settings.shape_transform_volume * (1.5 + this.explode * .0025);
            this.explode = Math.max(0, this.explode - this.animation.diff);

            if (this.isExplosion()) {
                this.explode = .5 * this.layer.getCurrentSpeed().duration;
            }

            let vertices = shape.geometry.getAttribute('position');
            let speeds = this.vertices;

            let vtc = new THREE.Vector3();
            for (let i = 0; i < vertices.count; i++) {
                let speed = speeds[i];
                vtc.fromBufferAttribute(vertices, i);

                if (speed.equals(vtc)) {
                    this.setSpeeds(speed, vtc);
                }

                vtc.x += this.animation.diffPrc * speed.x * multiplier;
                vtc.y += this.animation.diffPrc * speed.y * multiplier;
                vtc.z += this.animation.diffPrc * speed.z * multiplier;

                this.fixBounds(box.min.clone(), box.max.clone(), speed, vtc);
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
         * @param {THREE.Vector3} direction
         * @param {THREE.Vector3} point
         */
        fixBounds(min, max, direction, point) {

            if (this.explode > 0) {
                min.multiplyScalar(1.5 * this.settings.shape_transform_volume);
                max.multiplyScalar(1.5 * this.settings.shape_transform_volume);
            }
            if (point.x > max.x) {
                direction.x = -this.randomTurn(direction.x);
            }
            if (point.x < min.x) {
                direction.x = this.randomTurn(direction.x);
            }
            if (point.y > max.y) {
                direction.y = -this.randomTurn(direction.y);
            }
            if (point.y < min.y) {
                direction.y = this.randomTurn(direction.y);
            }
            if (point.z > max.z) {
                direction.z = -this.randomTurn(direction.z);
            }
            if (point.z < min.z) {
                direction.z = this.randomTurn(direction.z);
            }

            if (this.settings.shape_limit) {
                min.multiplyScalar(.25);
                max.multiplyScalar(.25);

                let box = new THREE.Box3(min, max);
                if (box.containsPoint(point)) {

                }
            }
        }



        /**
         * @param {THREE.Vector3} speed
         * @param {THREE.Vector3} reference
         */
        setSpeeds(speed, reference) {
            speed.x = this.randomSpeed();
            speed.y = this.randomSpeed();
            speed.z = this.randomSpeed();
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