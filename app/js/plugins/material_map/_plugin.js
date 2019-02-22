HC.plugins.material_map = HC.plugins.material_map || {};
{
    class Plugin extends HC.AnimationPlugin {
        reset() {
            this.dispose();
            this.texture = false;
            this.loading = false;
        }

        dispose() {
            if (this.texture) {
                this.texture.dispose();
            }
        }
    }

    HC.MaterialMapPlugin = Plugin;
}