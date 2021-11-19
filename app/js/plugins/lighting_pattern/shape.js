// {
//     HC.plugins.lighting_pattern.shape = class Plugin extends HC.LightingPatternPlugin {
//         apply(light) {
//             let i = light.userData.index;
//             let shape = this.layer.getShape(i);
//             if (shape) {
//             shape.getWorldPosition(light.position);
//
//             light.rotation.copy(shape.sceneRotation().rotation);
//
//             let ss = this.layer.shapeSize(1);
//             light.translateX(ss * this.settings.lighting_pattern_padding * this.settings.lighting_pattern_paddingx);
//             light.translateY(ss * this.settings.lighting_pattern_padding * this.settings.lighting_pattern_paddingy);
//             light.translateZ(ss * this.settings.lighting_pattern_padding * this.settings.lighting_pattern_paddingz);
//             }
//         }
//     }
// }