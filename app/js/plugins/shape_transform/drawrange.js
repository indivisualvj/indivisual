{
    HC.plugins.shape_transform.drawrangeprogress = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'drawrange progress';

        apply(shape) {
            let speed = this.layer.getCurrentSpeed();
            if (!this.settings.shape_sync) {
                speed = this.layer.getShapeSpeed(shape);
            }
            let l = shape.geometry.attributes.position.count;
            let v = this.settings.shape_transform_volume;
            let m = v < 0 ? 1 - speed.prc : speed.prc;
            m *= Math.abs(v);
            let a = Math.min(l, round(l * m));
            shape.geometry.setDrawRange(0, a);
            shape.geometry.attributes.position.needsUpdate = true;
        }
    }
}

{
    HC.plugins.shape_transform.drawrangeaudio = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'drawrange audio';

        apply(shape) {
            let volume = this.audioAnalyser.volume * 2;
            if (!this.settings.shape_sync) {
                volume = this.shapeVolume(shape);
            }
            let l = shape.geometry.attributes.position.count;
            let v = this.settings.shape_transform_volume;
            let m = v < 0 ? 1 - volume : volume;
            m *= Math.abs(v);
            let a = Math.min(l, round(l * m));
            shape.geometry.setDrawRange(0, a);
            shape.geometry.attributes.position.needsUpdate = true;
        }
    }
}

{
    HC.plugins.shape_transform.drawrangerandom = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'drawrange random';

        apply(shape) {
            if (this.layer.getCurrentSpeed().prc === 0) {
                let l = shape.geometry.attributes.position.count - 1;
                let a = randomInt(0, l);
                let b = randomInt(a, l);
                shape.geometry.setDrawRange(a, b - a);
                shape.geometry.attributes.position.needsUpdate = true;
            }
        }
    }
}