HC.plugins.filter_mode = HC.plugins.filter_mode || {};
{
    HC.FilterModePlugin = class Plugin extends HC.AnimationPlugin {
        before(shape) {
            // var locked = this.shapeFilterModeLocked(shape);
            // if (locked) {
            //     return false;
            // }
        }

        // shapeFilterModeLocked: function (shape, enabled) {
        //     if (shape) {
        //         var plugin = this.layer.getFilterModePlugin();
        //         var params = plugin.params(shape);
        //         if (enabled !== undefined) {
        //             params.__locked = enabled;
        //         }
        //         return params.__locked;
        //     }
        //
        //     return false;
        // }
    }
}