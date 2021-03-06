/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.MeshCameraMaterialPlugin = class MeshCameraMaterialPlugin extends HC.MeshMaterialPlugin {

        static index = 90;
        cameras;

        before(geometry) {

            if (!this.cameras) {
                this.cameras = new THREE.Group();
                this.cameras.name = this.id('cameras');
                this.layer.three.scene.add(this.cameras);
                this.cameras.position.copy(this.layer._rotation.position);
            }

            return super.before(geometry);
        }

        reset() {
            if (this.cameras) {
                this.layer.three.scene.remove(this.cameras);
                this.cameras.traverse(threeDispose);
                this.cameras = undefined;

                listener.removeLike(this.id());
            }
        }
    }
}