HC.plugins.offset_mode = HC.plugins.offset_mode || {};
{
    class Plugin extends HC.AnimationPlugin {
        after(shape) {
            var layer = this.layer;
            if (this.settings.offset_audio && audioman.isActive()) {
                var of = shape.offset();
                var vo = audio.volume;
                if (!this.settings.offset_sync) {
                    vo = shape.shapeVolume();
                }

                of.multiplyScalar(vo);

                if (this.settings.offset_limit) {
                    var ss = layer.shapeSize(1);
                    of.x = cutoff(of.x, ss);
                    of.y = cutoff(of.y, ss);
                    of.z = cutoff(of.z, ss);
                }
            }
        }
    }

    HC.OffsetModePlugin = Plugin;
}