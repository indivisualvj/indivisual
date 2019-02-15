HC.plugins.shape_modifier = HC.plugins.shape_modifier || {};

HC.ShapeModifierPlugin = _class(false, HC.AnimationPlugin, {

    apply: function (geometry) {
        if (!this.geometry) { // all meshes use the same geometry
            geometry = this.create(geometry);

            this.geometry = geometry;
        }

        return this.geometry;
    },

    reset: function () {
        this.geometry = false;
    },

    create: function (geometry) {
        console.error('HC.ShapeModifierPlugin: .create() must be implemented in derived plugin.');
    },

    assignUVs: assignUVs,
});