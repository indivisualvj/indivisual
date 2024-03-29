/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {_Layer} from "./LightingLayer";
import {Shape} from "../Shape";
import {BoxGeometry, Mesh, MeshBasicMaterial, PlaneGeometry} from "three";

class Layer extends _Layer
{

    /**
     *
     * @param index
     * @param dummy
     * @returns {Shape}
     */
    nextShape(index, dummy) {
        let mesh = dummy
            ? new Mesh(new BoxGeometry(), new MeshBasicMaterial())
            : this.nextMesh(index);

        let shape = new Shape(mesh, index, randomColor());
        if (dummy) {
            shape.setVisible(false);
        }

        this.nextShapeDirection(shape);
        this.nextShapeRhythm(shape);
        // this.nextDelay(shape); // no delay for new shapes
        this.nextShapeRotation(shape);

        if (shape.isVisible()) {
            // new shapes need coordinates for other plugins to use them especially pattern_mover
            this.doPlugin(this.getPatternPlugin(), shape);
        }

        return shape;
    };

    /**
     *
     * @param geometry
     */
    nextShapeModifier(geometry) {
        let modifier = this.getShapeModifierPlugin();
        return this.doPlugin(modifier, geometry);
    };

    /**
     *
     * @param shape
     */
    nextShapeDirection(shape) {
        let direction = this.getRotationDirectionPlugin();
        this.doPlugin(direction, shape);
    };

    /**
     *
     * @param index
     * @returns {Mesh|boolean}
     */
    nextMesh(index) {

        let geometry = this.nextGeometry();
        geometry = this.nextShapeModifier(geometry);

        if (geometry) {
            let plugin = this.getMeshMaterialPlugin();
            if (plugin) {
                if (plugin.before) {
                    geometry = plugin.before(geometry);
                }

                let mesh = plugin.apply(geometry, index);

                if (plugin.after) {
                    plugin.after(mesh);
                }

                return mesh;
            }
        }

        return false;
    };

    /**
     *
     * @returns {Geometry|PlaneGeometry}
     */
    nextGeometry() {
        let plugin = this.getShapeGeometryPlugin();
        if (plugin && plugin.apply) {

            let geometry = plugin.apply();

            if (plugin.after) {
                plugin.after(geometry);
            }

            return geometry;

        }

        return new PlaneGeometry(this.shapeSize(.1), this.shapeSize(1));
    };

    /**
     *
     * @param shape
     */
    nextShapeDelay(shape) {

        let delay = this.shapeDelayPlugin();
        this.doPlugin(delay, shape);

    };

    /**
     *
     * @param shape
     */
    nextShapeRhythm(shape) {

        if (this.config.ControlSettings.beat) {
            let plugin = this.getShapeRhythmPlugin();
            this.doPlugin(plugin, shape);

        } else {
            let max = 200000 / this.config.ControlSettings.tempo;
            let min = max / 1.5;
            this.getShapeRhythmPlugin().params(shape).duration = randomInt(min, max);
        }
    };

    /**
     *
     * @param shape
     */
    nextShapeRotation(shape) {
        let rotation = this.getRotationModePlugin();
        this.doPlugin(rotation, shape);
    };

}

export {Layer as _Layer}