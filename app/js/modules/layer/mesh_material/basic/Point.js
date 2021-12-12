/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";
import {EdgesGeometry, Points, PointsMaterial} from "three";

class point extends MeshMaterialPlugin {
    static index = 10;
    static name = 'points';

    apply(geometry, index) {
        this.material = new PointsMaterial();
        return new Points(geometry, this.material);
    }
}


class pointedges extends MeshMaterialPlugin {
    static index = 10;
    static name = 'points (edges only)';

    mesh;
    edges;

    apply(geometry, index) {
        this.material = new PointsMaterial();
        if (!this.edges) {
            this.edges = new EdgesGeometry(geometry);
        }
        this.mesh = new Points(this.edges, this.material);

        return this.mesh;
    }

    reset() {
        super.reset();
        this.mesh = null;
        this.edges = null;
    }
}

export {point, pointedges};
