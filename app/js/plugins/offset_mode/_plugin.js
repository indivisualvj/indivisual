HC.plugins.offset_mode = HC.plugins.offset_mode || {};
{
    class Plugin extends HC.AnimationPlugin {
        after(shape) {
            let layer = this.layer;
            if (this.settings.offset_audio && audioman.isActive()) {
                let of = shape.offset();
                let vo = audio.volume;
                if (!this.settings.offset_sync) {
                    vo = shape.shapeVolume();
                }

                of.multiplyScalar(vo);

                if (this.settings.offset_limit) {
                    let ss = layer.shapeSize(1);
                    of.x = cutoff(of.x, ss);
                    of.y = cutoff(of.y, ss);
                    of.z = cutoff(of.z, ss);
                }
            }
        }
    }

    HC.OffsetModePlugin = Plugin;
}