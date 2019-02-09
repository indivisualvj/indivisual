HC.plugins.background_mode.static = _class(false, HC.BackgroundModePlugin, {
    apply: function () {
        // todo setzt nach umschaltung von transparent oder blitz nicht auf farbe zurück
        if (this.current() != this.settings.background_color) {
            this.layer.setBackground(new THREE.Color(this.current(this.settings.background_color)));
        }
    }
});