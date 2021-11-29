{
    HC.Layer = class Layer extends HC.Layer {

        /**
         *
         * @returns {THREE.PerspectiveCamera}
         */
        getCamera() {
            return this.three.camera;
        }

        /**
         *
         */
        centerCamera() {
            let cam = this.getCamera();
            cam.position.x = 0;
            cam.position.y = 0;
            cam.position.z = this.cameraDefaultDistance();
        }

        /**
         *
         */
        updateCameraFov() {
            let cam = this.getCamera();
            let sina = sinAlpha(this.resolution('half').y * 1.015, this.cameraDefaultDistance());

            cam.fov = sina * this.config.DisplaySettings.fov;
        }

        /**
         *
         * @param object
         * @returns {*}
         */
        cameraIntersectsObject(object) {
            let camera = this.getCamera();
            let frustum = new THREE.Frustum();
            let cameraViewProjectionMatrix = new THREE.Matrix4();

            // every time the camera or objects change position (or every frame)

            camera.updateMatrixWorld(); // make sure the camera matrix is updated
            camera.matrixWorldInverse.getInverse(camera.matrixWorld);
            cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            frustum.setFromMatrix(cameraViewProjectionMatrix);

            // frustum is now ready to _check all the objects you need

            return (frustum.intersectsObject(object));
        }

        /**
         *
         * @param multiplier
         * @returns {number}
         */
        cameraDefaultDistance(multiplier) {

            return this.resolution().length() * (multiplier || 1);
        }

    }
}