HC.plugins.offset_mode = HC.plugins.offset_mode || {};

HC.OffsetModePlugin = _class(false, HC.Plugin, {
    after: function (shape) {
        var layer = this.layer;
        if (this.settings.offset_audio) {
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
});
