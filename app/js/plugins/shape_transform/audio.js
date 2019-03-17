{
    HC.plugins.shape_transform.audio = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'audio xyz';

        apply(shape, axis) {

            if (!shape.getVertices()) {
                shape.setGeometry(shape.geometry.userData.geometry);
            }

            let vbackup = shape.verticesCopy;
            let vertices = shape.getVertices();

            if (vertices && vbackup && this.isFirstShape(shape)) {

                let ai = 0;
                for (let i = 0; i < vertices.length; i++) {

                    let x = 1, y = 1, z = 1;

                    let v = this.settings.shape_sync ? audio.volume : audio.volumes[ai++];
                    if (ai >= audio.volumes.length) { // cycle through frequency volumes until all vertices have data
                        ai = 0;
                    }

                    v *= this.settings.shape_transform_volume;

                    if (this.settings.shape_limit) {
                        v += 1.0;
                    }

                    if (axis) {
                        switch (axis) {
                            case 'x':
                                x *= v;
                                break;
                            case 'y':
                                y *= v;
                                break;
                            case 'z':
                                z *= v;
                                break;
                            case 'xy':
                                x *= v;
                                y *= v;
                                break;
                        }
                    } else {
                        x *= v;
                        y *= v;
                        z *= v;
                    }

                    let vtc = vertices[i];
                    let vtcb = vbackup[i];
                    vtc.x = vtcb.x * x;
                    vtc.y = vtcb.y * y;
                    vtc.z = vtcb.z * z;

                }
                shape.geometry.verticesNeedUpdate = true;
                shape.geometry.lineDistancesNeedUpdate = true;

            } else if (!vertices) {
                console.warn('No transform for ' + shape.geometry.type);
            }
        }
    }
}
{
    HC.plugins.shape_transform.audiox = class Plugin extends HC.plugins.shape_transform.audio {
        static name = 'audio x';

        apply(shape) {
            super.apply(shape, 'x');
        }
    }
}
{
    HC.plugins.shape_transform.audioy = class Plugin extends HC.plugins.shape_transform.audio {
        static name = 'audio y';

        apply(shape) {
            super.apply(shape, 'y');
        }
    }
}
{
    HC.plugins.shape_transform.audioz = class Plugin extends HC.plugins.shape_transform.audio {
        static name = 'audio z';

        apply(shape) {
            super.apply(shape, 'z');
        }
    }
}
{
    HC.plugins.shape_transform.audioxy = class Plugin extends HC.plugins.shape_transform.audio {
        static name = 'audio xy';

        apply(shape) {
            super.apply(shape, 'xy');
        }
    }
}