HC.plugins.shape_geometry = HC.plugins.shape_geometry || {};

HC.ShapeGeometryPlugin = _class(false, HC.Plugin, {

    apply: function () {
        if (!this.geometry) { // all meshes use the same geometry
            var geometry = this.create();

            this.geometry = geometry;
        }

        return this.geometry;
    },

    reset: function () {
        this.geometry = false;
    },

    create: function () {
        console.error('HC.ShapeGeometryPlugin: .create() must be implemented in derived plugin.');
    },

    assignUVs: assignUVs,
});