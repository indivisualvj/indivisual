/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";

class edges extends MeshMaterialPlugin {
        static index = 10;

        mesh;
        edges;

        apply(geometry) {
            this.material = new THREE.LineBasicMaterial();
            if (!this.edges) {
                this.edges = new THREE.EdgesGeometry(geometry);
            }
            this.mesh = new THREE.LineSegments(this.edges, this.material);

            this.mesh.computeLineDistances();

            return this.mesh;
        }

        reset() {
            super.reset();
            this.mesh = null;
            this.edges = null;
        }
    }

export {edges};
