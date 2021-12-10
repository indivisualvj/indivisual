/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeModifierPlugin} from "../ShapeModifierPlugin";

class extrude extends ShapeModifierPlugin {
    static name = 'extrude';
    static tutorial = {
        shape_modc: {
            text: 'set bevel\'s size, thickness and roundness'
        }
    };

    create(geometry) {
        let layer = this.layer;

        let shape;
        let moved = false;

        if (geometry.parameters && geometry.parameters.shapes) {
            shape = geometry.parameters.shapes;

        } else {
            shape = new THREE.Shape();
            geometry.center();

            let vertices = geometry.getAttribute('position');
            let v = new THREE.Vector3();
            for (let i = 0; i < vertices.count; i++) {
                v.fromBufferAttribute(vertices, i);

                if (v.x !== 0 || v.y !== 0) {
                    if (moved === false) {
                        shape.moveTo(v.x, v.y);
                        moved = i;

                    } else {
                        shape.lineTo(v.x, v.y);
                    }
                }
            }
            if (moved !== false) {
                v.fromBufferAttribute(vertices, moved);
                shape.lineTo(v.x, v.y);

            } else {
                shape = false;
            }
        }

        if (shape) {
            let conf = {
                steps: 1,
                depth: layer.shapeSize(this.settings.shape_modifier_volume),
                bevelEnabled: this.settings.shape_modc,
                bevelThickness: this.settings.shape_modc,
                bevelSize: this.settings.shape_modc,
                bevelSegments: Math.ceil(this.settings.shape_modc / 2),
            };

            geometry = new THREE.ExtrudeGeometry(shape, conf);
            geometry.center();

            HC.GeometryUtils.front2back(geometry);
        }

        return geometry;
    }
}

export {extrude};
