{
    HC.plugins.shape_transform.wave = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'wave xyz by y';
        angle;

        apply(shape, source, axes) {

            if (!shape.getVertices()) {
                shape.setGeometry(shape.getRootGeometry());
            }

            if (this.isFirstShape(shape)) {
                source = source || 'y';
                axes = axes || new THREE.Vector3(1, 1, 1);

                if (this.angle === undefined) {
                    this.angle = 0;
                    this.min = 0;
                    this.max = 0;
                }

                let dir = this.settings.shape_transform_volume > 0 ? 1 : -1;
                this.angle += dir * animation.getFrameDurationPercent(this.layer.getCurrentSpeed().duration, .005);

                let vertices = shape.getVertices();
                let vbackup = shape.verticesCopy;

                if (vertices) {

                    for (let i = 0; i < vertices.length; i++) {

                        let vtc = vertices[i];
                        let vtcb = vbackup[i];

                        let v = vtcb[source];

                        this.min = Math.min(v, this.min);
                        this.max = Math.max(v, this.max);
                        let div = Math.abs(this.min - this.max) / 20;

                        v = Math.sin(this.angle * RAD + ((v + .5 * div) / div)) / 2 * Math.abs(this.settings.shape_transform_volume);

                        vtc.x = vtcb.x + vtcb.x * v * axes.x;
                        vtc.y = vtcb.y + vtcb.y * v * axes.y;
                        vtc.z = vtcb.z + vtcb.z * v * axes.z;

                    }
                    shape.geometry.verticesNeedUpdate = true;
                    shape.geometry.lineDistancesNeedUpdate = true;

                } else if (!vertices) {
                    console.warn('No transform for ' + shape.geometry.type);
                }
            }
        }
    }
}
{
    HC.plugins.shape_transform.wavexzby = class Plugin extends HC.plugins.shape_transform.wave {
        static name = 'wave xz by y';

        apply(shape) {
            HC.plugins.shape_transform.wave.prototype.apply.call(this, shape, 'y', new THREE.Vector3(1, 0, 1));
        }
    }
}
{
    HC.plugins.shape_transform.wavexby = class Plugin extends HC.plugins.shape_transform.wave {
        static name = 'wave x by y';

        apply(shape) {
            HC.plugins.shape_transform.wave.prototype.apply.call(this, shape, 'y', new THREE.Vector3(1, 0, 0));
        }
    }
}
{
    HC.plugins.shape_transform.wavexybz = class Plugin extends HC.plugins.shape_transform.wave {
        static name = 'wave xy by z';

        apply(shape) {
            HC.plugins.shape_transform.wave.prototype.apply.call(this, shape, 'z', new THREE.Vector3(1, 1, 0));
        }
    }
}