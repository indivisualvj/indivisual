// todo refactor: mesh_material

HC.plugins.mesh_material = HC.plugins.mesh_material || {};

HC.MeshMaterialPlugin = _class(false, HC.Plugin, {
    after: function (mesh) {
        var m = mesh.material;
        // m.dithering = true;
        m.shadowSide = THREE.BackSide;
        // m.needsUpdate = true;
    }
});