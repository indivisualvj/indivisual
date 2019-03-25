{
    HC.plugins.background_mode.layer = class Plugin extends HC.BackgroundModePlugin {
        static index = 70;
        static tutorial = {
            layer: {
                text: 'set background_config to any of the available layers (1-20)'
            }
        };
        _layer;

        apply() {
            let ind = parseInt(this.settings.background_config) || 1;
            ind--;

            if (!this._layer || this._layer.index != ind) {
                this.reset();

                let layer = renderer.layers[ind];
                this._layer = layer;

                let inst = this;
                listener.register('renderer.render', this.id(this.settings.background_config), function (renderer) {
                    if (inst.layer.isVisible()) {
                        renderer.three.scene.add(layer._layer);
                        layer.animate();

                    }
                });
            }
        }

        reset() {
            listener.removeLike(this.id());

            if (this.layer && this._layer) {
                this.layer.three.scene.remove(this._layer._layer);
                this.layer.renderer.setLayer(this.layer.index);
            }

            this._layer = undefined;
        }

        /**
         * super.super.id @see HC.AnimationPlugin.id
         * @param suffix
         * @returns {string}
         */
        id(suffix) {
            return this.layer.index + '.' + this.tree + '.' + this.key + (suffix!==undefined?'.' + suffix:'');
        }
    }
}