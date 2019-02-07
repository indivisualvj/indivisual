HC.plugins.shape_modifier = HC.plugins.shape_modifier || {};

HC.ShapeModifierPlugin = _class(false, HC.Plugin, {

    apply: function (geometry) {
        if (!this.geometry) { // all meshes use the same geometry
            geometry = this.create(geometry);
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

            var geo;
            if (geometry.isGeometry) {
                geo = new THREE.BufferGeometry().fromGeometry(geometry);

            } else {
                geo = new THREE.BufferGeometry().setFromObject(geometry);
            }

            if (geo) {
                geo.userData.geometry = geometry;
                geometry = geo;
            }

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