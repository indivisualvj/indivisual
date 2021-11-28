{
    HC.plugins.shape_transform.drawrangeprogress = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'drawrange progress';

        apply(shape) {
            let speed = this.layer.getCurrentSpeed();
            let p = shape.geometry.attributes.position;
            let l = p.count * p.itemSize;
            let v = this.settings.shape_transform_volume;
            let m = v < 0 ? 1 - speed.prc : speed.prc;
            m *= Math.abs(v);
            let a = Math.min(l, round(l * m));

            shape.geometry.setDrawRange(0, a);
        }
    }
}

{
    HC.plugins.shape_transform.drawrangeaudio = class Plugin extends HC.ShapeTransformPlugin {
        static name = 'drawrange audio';

        apply(shape) {
            let volume = this.audioAnalyser.volume;
            let p = shape.geometry.attributes.position;
            let l = p.count * p.itemSize;
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
            if (this.layer.getCurrentSpeed().prc === 0 || (this.audioAnalyser.peak && randomBool(3))) {
                let p = shape.geometry.attributes.position;
                let l = p.count * p.itemSize;
                let a = randomInt(0, l/2);
                let b = randomInt(a, l);
                shape.geometry.setDrawRange(a, b);
                shape.geometry.attributes.position.needsUpdate = true;
            }
        }
    }
}