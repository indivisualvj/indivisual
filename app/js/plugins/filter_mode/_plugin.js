HC.plugins.filter_mode = HC.plugins.filter_mode || {};
{
    HC.FilterModePlugin = class Plugin extends HC.AnimationPlugin {
        before(shape) {
            // let locked = this.shapeFilterModeLocked(shape);
            // if (locked) {
            //     return false;
            // }
        }

        // shapeFilterModeLocked(shape, enabled) {
        //     if (shape) {
        //         let plugin = this.layer.getFilterModePlugin();
        //         let params = plugin.params(shape);
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