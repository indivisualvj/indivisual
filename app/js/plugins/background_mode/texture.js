HC.plugins.background_mode.texture = _class(false, HC.BackgroundModePlugin, {
    index: 40,
    apply: function () {
        var i = this.settings.background_input;
        var id = this._id() + i;
        var file;

        if (this.current() != id) {
            if (file = assetman.getImage(i)) {
                this.current(id);
                var inst = this;
                var path = filePath(IMAGE_DIR, file);

                new THREE.TextureLoader().load(path, function (texture) {
                    texture.center.set(.5, .5);
                    inst.img = texture;

                    inst.layer.setBackground(texture);
                });

            } else {
                this.layer.setBackground(this.current(false));
            }
        }

        if (this.img) {
            var v = 1 / this.settings.background_volume;
            if (this.img.repeat.x != v) {
                this.img.repeat.set(v, v);
            }
        }
    },

    dispose: function () {
        if (this.img && this.img.dispose) {
            this.img.dispose();
        }
    }
});