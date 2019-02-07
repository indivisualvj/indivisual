// todo refactor: mesh_material

HC.plugins.material_mesh = HC.plugins.material_mesh || {};

HC.MaterialMeshPlugin = _class(false, HC.Plugin, {
    after: function (mesh) {
        var m = mesh.material;
        // m.dithering = true;
        m.shadowSide = THREE.BackSide;
        // m.needsUpdate = true;
    }
});