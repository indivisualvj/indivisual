/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {GeometryUtils} from "../../shared/GeometryUtils";
import {AnimationPlugin} from "../AnimationPlugin";

class ShapeGeometryPlugin extends AnimationPlugin {

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.shape.properties;
    }

    apply() {
        if (!this.geometry) { // all meshes use the same geometry
            let geometry = this.create();
            geometry = GeometryUtils.mergeVertices(geometry, this.settings.shape_merge_tolerance);

            if (this.controlSets.material.properties.material_mapping === 'f2b') {
                GeometryUtils.front2back(geometry);
            }

            if (!this.ready()) { // return (fallback) geometry
                return geometry;
            }

            this.geometry = geometry;
        }

        return this.geometry;
    }

    reset() {
        this.geometry = false;
    }

    create() {
        console.error('HC.ShapeGeometryPlugin: .create() must be implemented in derived plugin.');
        return null;
    }

    getModA(min, fallback, max) {
        if (this.settings.shape_moda < min) {
            return fallback;
        }
        max = max || this.settings.shape_moda;

        return Math.min(max, this.settings.shape_moda);
    }

    getModB(min, fallback, max) {
        if (this.settings.shape_modb < min) {
            return fallback;
        }

        max = max || this.settings.shape_modb;

        return Math.min(max, this.settings.shape_modb);
    }

    getModC(min, fallback, max) {
        if (this.settings.shape_modc < min) {
            return fallback;
        }

        max = max || this.settings.shape_modc;

        return Math.min(max, this.settings.shape_modc);
    }
}

export {ShapeGeometryPlugin};
