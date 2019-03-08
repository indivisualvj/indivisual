// {
//     HC.plugins.mesh_material.refraction = class Plugin extends HC.MeshMaterialPlugin {
//         static index = 90;
//
//         apply(geometry, index) {
//
//             // todo refractionRatio==shinyness?
//             var material = new THREE.MeshBasicMaterial({
//                 envMap: new THREE.Texture(),
//                 color: 0xffffff,
//                 refractionRatio: 0.95
//             });
//
//             let plug = this.layer.getBackgroundModePlugin('texture');
//             if (plug.img) {
//                 material.envMap = plug.img;
//                 material.envMap.generateMipmaps = true;
//                 material.envMap.mapping = THREE.CubeRefractionMapping;
//                 material.needsUpdate = true;
//             }
//
//             let mesh = new THREE.Mesh(geometry, material);
//
//             let inst = this;
//             listener.register('animation.updateSetting', this.id(index), function (data) {
//                 if (inst.layer.isVisible()) {
//                     switch (data.item) {
//                         case 'background_mode':
//                         case 'background_input':
//                             inst.apply(geometry, index);
//                             break;
//                     }
//                 }
//             });
//
//             return mesh;
//         }
//
//         reset() {
//
//         }
//     }
// }