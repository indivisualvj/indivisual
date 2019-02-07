HC.plugins.sizing_mode = HC.plugins.sizing_mode || {};

HC.SizingModePlugin = _class(false, HC.Plugin, {
    after: function (shape) {
        var layer = this.layer;
        if (this.settings.sizing_audio) {
            var of = shape.scale();
            var vo = audio.volume;
            if (!this.settings.sizing_sync) {
                vo = shape.shapeVolume();
            }

            of.multiplyScalar(vo);

            if (this.settings.sizing_limit) {
                of.x = cutoff(of.x, 1);
                of.y = cutoff(of.y, 1);
                of.z = cutoff(of.z, 1);
            }
        }
    }
});
