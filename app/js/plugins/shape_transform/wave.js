{
    HC.plugins.shape_transform.wave = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'wave (xyz by y)';

        angles;

        apply(shape, sources, axes) {
            sources = sources || ['y'];
            axes = axes || new THREE.Vector3(1, 1, 1);

            if (this.angle === undefined) {
                this.angle = 0;
                this.min = 0;
                this.max = 0;
            }

            let dir = this.settings.shape_transform_volume > 0 ? 1 : -1;
            this.angle += dir * this.animation.getFrameDurationPercent(this.layer.getCurrentSpeed().duration, .005);

            let vertices = shape.geometry.getAttribute('position');
            let vbackup = this.vertices;

            for (let i = 0; i < vertices.count; i++) {
                let vtcb = vbackup[i];
                let vtc = vtcb.clone();
                for (let s = 0; s < sources.length; s++) {
                    let source = sources[s];

                    let v = vtcb[source];
                    this.min = Math.min(v, this.min);
                    this.max = Math.max(v, this.max);
                    let div = Math.abs(this.min - this.max) / 20;

                    v = Math.sin(this.angle * RAD + ((v + .5 * div) / div)) / (4 * sources.length * Math.abs(this.settings.shape_transform_volume));

                    vtc.set(
                        vtc.x + vtcb.x * v * axes.x,
                        vtc.y + vtcb.y * v * axes.y,
                        vtc.z + vtcb.z * v * axes.z
                    );
                }

                vertices.setXYZ(i,
                    vtc.x,
                    vtc.y,
                    vtc.z
                );
            }
        }
    }
}
{
    HC.plugins.shape_transform.wavexzby = class Plugin extends HC.plugins.shape_transform.wave {
        static name = 'wave (xz by y)';

        apply(shape) {
            HC.plugins.shape_transform.wave.prototype.apply.call(this, shape, ['y'], new THREE.Vector3(1, 0, 1));
        }
    }
}
{
    HC.plugins.shape_transform.wavexby = class Plugin extends HC.plugins.shape_transform.wave {
        static name = 'wave (x by y)';

        apply(shape) {
            HC.plugins.shape_transform.wave.prototype.apply.call(this, shape, ['y'], new THREE.Vector3(1, 0, 0));
        }
    }
}
{
    HC.plugins.shape_transform.wavexybz = class Plugin extends HC.plugins.shape_transform.wave {
        static name = 'wave (xy by z)';

        apply(shape) {
            HC.plugins.shape_transform.wave.prototype.apply.call(this, shape, ['z'], new THREE.Vector3(1, 1, 0));
        }
    }
}
{
    HC.plugins.shape_transform.waveall = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'wave (all)';

        apply(shape) {
            HC.plugins.shape_transform.wave.prototype.apply.call(this, shape, ['x', 'y', 'z'], new THREE.Vector3(1, 1, 1));
        }
    }
}