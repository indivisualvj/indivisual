HC.plugins.shape_geometry = HC.plugins.shape_geometry || {};

HC.ShapeGeometryPlugin = _class(false, HC.Plugin, {

    apply: function () {
        if (!this.geometry) { // all meshes use the same geometry
            var geometry = this.create();
            if (!geometry._uvsAssigned) {

                if (this.settings.material_mapping == 'f2b') {
                    this.assignUVs(geometry);
                }

                if (geometry.mergeVertices) {
                    geometry.mergeVertices();
                }
                if (geometry.computeFaceNormals) {
                    geometry.computeFaceNormals();
                }
                if (geometry.computeFlatVertexNormals) {
                    geometry.computeFlatVertexNormals();
                }
                if (geometry.computeVertexNormals) {
                    geometry.computeVertexNormals();
                }
                geometry.elementsNeedUpdate = true;
                geometry.verticesNeedUpdate = true;
            }

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