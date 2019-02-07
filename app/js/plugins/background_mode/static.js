HC.plugins.background_mode.static = _class(false, HC.BackgroundModePlugin, {
    apply: function () {
        // todo setzt nach umschaltung von transparent oder blitz nicht auf farbe zurück
        var layer = this.layer;
        if (this.current() != this.settings.background_color) {
            this.layer.setBackground(this.current(this.settings.background_color));
        }
    }
});