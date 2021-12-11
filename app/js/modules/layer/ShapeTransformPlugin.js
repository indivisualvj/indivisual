/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../../shared/AnimationPlugin";

class ShapeTransformPlugin extends AnimationPlugin {

    vertices;

    before(shape) {
        if (this._doesThings() && !this.vertices) {
            shape.geometry.computeBoundingBox();
            shape.geometry.computeBoundingSphere();
            let vertices = shape.geometry.getAttribute('position');
            this.vertices = [];
            let v = new THREE.Vector3();
            for (let i = 0; i < vertices.count; i++) {
                v.fromBufferAttribute(vertices, i);
                this.vertices.push(v.clone());
            }
        }

        return this.isFirstShape(shape);
    }

    after(shape) {
        if (this._doesThings()) {
            if (shape.geometry.attributes.lineDistance) {
                shape.geometry.attributes.lineDistance.needsUpdate = true;
            }
            shape.geometry.attributes.position.needsUpdate = true;
        }
    }

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all those plugins make use of corresponding controlset only
        this.settings = controlSets.shape.properties;
    }

    reset() {
        this.vertices = null;
    }

    _doesThings() {
        return true;
    }
}

export {ShapeTransformPlugin}