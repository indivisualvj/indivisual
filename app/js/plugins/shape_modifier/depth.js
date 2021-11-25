{
    HC.plugins.shape_modifier.depth = class Plugin extends HC.ShapeModifierPlugin {
        static name = 'depth center';

        create(geometry, mode) {
            let layer = this.layer;
            let z = 0;

            let vertices = geometry.getAttribute('position');

            if (vertices) {

                let vtc = new THREE.Vector3();
                for (let i = 0; i < vertices.count; i++) {
                    vtc.fromBufferAttribute(vertices, i);

                    switch (mode) {

                        default:
                        case 'center':
                            z = vtc.length() * -.5;
                            break;

                        case 'flat':
                            z = 0;
                            break;

                        case 'zigzag':
                            z = Math.sin(Math.abs(vtc.x * 10)) * -.5 + Math.cos(Math.abs(vtc.y * 10)) * -layer.shapeSize(.5);
                            break;

                        case 'random':
                            z = Math.sin(Math.abs(vtc.x * randomInt(0, 10))) * -.5 + Math.cos(Math.abs(vtc.y * randomInt(0, 10))) * -layer.shapeSize(.5);
                            break;

                        case 'sinus':
                            z = Math.sin(Math.abs(vtc.x)) * -1 + Math.cos(Math.abs(vtc.y)) * -layer.shapeSize(.5);
                            break;

                    }

                    vertices.setZ(i, z * this.settings.shape_modifier_volume);
                }
                vertices.needsUpdate = true;

            } else {
                console.warn('No transform for ' + geometry.type);
            }

            return geometry;
        }
    }
}
{
    HC.plugins.shape_modifier.depthzigzag = class Plugin extends HC.plugins.shape_modifier.depth {
        static name = 'depth zigzag';

        create(geometry) {
            return HC.plugins.shape_modifier.depth.prototype.create.call(this, geometry, 'zigzag');
        }
    }
}