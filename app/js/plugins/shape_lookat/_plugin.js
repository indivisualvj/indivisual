HC.plugins.shape_lookat = HC.plugins.shape_lookat || {};

HC.ShapeLookatPlugin = _class(false, HC.Plugin, {
    before: function (shape) {
        var pattern = this.layer.getPatternPlugin();
        if (pattern.shared && pattern.shared.locking && pattern.shared.locking.disabled) {
            return false;
        }
    }
});