/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";
import {EdgesGeometry, LineBasicMaterial, LineSegments} from "three";

class edges extends MeshMaterialPlugin {
    static index = 10;

    mesh;
    edges;

    apply(geometry) {
        this.material = new LineBasicMaterial();
        if (!this.edges) {
            this.edges = new EdgesGeometry(geometry);
        }
        this.mesh = new LineSegments(this.edges, this.material);

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
