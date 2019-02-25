// HC.plugins.shape_geometry.lineh = _class(false, HC.ShapeGeometryPlugin, {
//     name: 'line horizontal',
//     create: function () {
//         var layer = this.layer;
//
//         var segments = (this.settings.shape_variant);
//         var geometry = new THREE.PlaneGeometry(Math.max(renderer.resolution.x, renderer.resolution.y) * 4, layer.shapeSize(1) / 20, segments, Math.max(1, segments / 8));
//         return geometry;
//     }
// });
//
// HC.plugins.shape_geometry.linev = _class(false, HC.ShapeGeometryPlugin, {
//     name: 'line vertical',
//     create: function () {
//         var layer = this.layer;
//
//         var segments = (this.settings.shape_variant);
//         var geometry = new THREE.PlaneGeometry(layer.shapeSize(1) / 20, Math.max(renderer.resolution.x, renderer.resolution.y) * 4, Math.max(1, segments / 8), segments);
//         return geometry;
//     }
// });
