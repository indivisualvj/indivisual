HC.plugins.shape_lookat = HC.plugins.shape_lookat || {};
{
    HC.ShapeLookatPlugin = class Plugin extends HC.AnimationPlugin {
        before(shape) {
            var pattern = this.layer.getPatternPlugin();
            if (pattern.shared && pattern.shared.locking && pattern.shared.locking.disabled) {
                return false;
            }
        }
    }
}