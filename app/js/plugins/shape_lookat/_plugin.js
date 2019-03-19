HC.plugins.shape_lookat = HC.plugins.shape_lookat || {};
{
    HC.ShapeLookatPlugin = class Plugin extends HC.AnimationPlugin {
        before(shape) {
            let pattern = this.layer.getPatternPlugin();
            if (pattern.shared && pattern.shared.locking && pattern.shared.locking.disabled) {
                return false;
            }
        }

        centerVector() {
            let v = this.layer.cameraDefaultDistance();
            return new THREE.Vector3(
                v * this.settings.shape_lookat_centerx,
                v * this.settings.shape_lookat_centery,
                v * this.settings.shape_lookat_centerz
            );
        }

    }
}