HC.plugins.lighting_lookat = HC.plugins.lighting_lookat || {};
{
    HC.LightingLookatPlugin = class Plugin extends HC.AnimationPlugin {

        params(light) {
            return light.userData;
        }

        isFirstShape(light) {
            return light.userData.index == 0;
        }

        centerVector() {
            var v = this.layer.cameraDefaultDistance(.25);
            return new THREE.Vector3(
                v * this.settings.lighting_lookat_centerx,
                v * this.settings.lighting_lookat_centery,
                v * this.settings.lighting_lookat_centerz
            );
        }
    }
}