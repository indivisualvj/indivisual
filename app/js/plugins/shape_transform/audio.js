{
    HC.plugins.shape_transform.audio = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'audio xyz';

        vertices;

        apply(shape, axis) {
            let vertices = shape.geometry.getAttribute('position');
            let vbackup = this.vertices;

            let ai = 0;
            for (let i = 0; i < vertices.count; i++) {

                let x = 1, y = 1, z = 1;

                let v = this.settings.shape_sync ? this.audioAnalyser.volume : this.audioAnalyser.getVolume(ai++);

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

                let vtcb = vbackup[i];
                vertices.setX(i, vtcb.x?vtcb.x * x : x*x*x);
                vertices.setY(i, vtcb.y?vtcb.y * y : y*y*y);
                vertices.setZ(i, vtcb.z?vtcb.z * z : z*z*z);
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
