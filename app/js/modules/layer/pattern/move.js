/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";

class move extends PatternPlugin {
        static name = 'move';
        injections = {
            velocity: false,
            euler: false
        };

        apply(shape) {
            let layer = this.layer;


            let params = this.params(shape);

            let x = shape.x();
            let y = shape.y();
            let z = shape.z();

            if (!params.velocity) {

                x = randomInt(0, layer.resolution().x);
                y = randomInt(0, layer.resolution().y);
                z = 0;
                shape.position(x, y, z);

                params.velocity = randomInt(2, 5, false);

            }

            let roto = shape.rotation();
            let dir = new THREE.Vector3(0, 0, 1);
            dir.applyEuler(roto);

            let m = params.velocity * this.animation.diffPrc * this.settings.pattern_padding;
            dir.multiplyScalar(m);

            shape.position().add(dir);

            if (x > layer.resolution().x + layer.shapeSize(.5)) {
                shape.x(-layer.shapeSize(.5));

            } else if (x < -layer.shapeSize(.5)) {
                shape.x(layer.resolution().x + layer.shapeSize(.5));
            }

            if (y > layer.resolution().y + layer.shapeSize(.5)) {
                shape.y(-layer.shapeSize(.5));

            } else if (y < -layer.shapeSize(.5)) {
                shape.y(layer.resolution().y + layer.shapeSize(.5));
            }

            if (z > layer.cameraDefaultDistance() || z < -layer.cameraDefaultDistance()) {
                shape.z(0);
            }
        }
    }

export {move};
