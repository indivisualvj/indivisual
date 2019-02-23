HC.plugins.lighting_pattern = HC.plugins.lighting_pattern || {};
{
    HC.LightingPatternPlugin = class Plugin extends HC.AnimationPlugin {
        centerVector() {
            var v = this.layer.cameraDefaultDistance(.25);
            return new THREE.Vector3(
                v * this.settings.lighting_pattern_centerx,
                v * this.settings.lighting_pattern_centery,
                v * this.settings.lighting_pattern_centerz
            );
        }

        positionIn2dSpace(light, x, y, z) {
            var cp = new THREE.Vector3(x, y, z);
            cp.applyEuler(new THREE.Euler(0, 0, -this.settings.lighting_pattern_rotation * 90 * RAD));
            cp.add(this.centerVector());
            light.position.copy(cp);
        }
    }
}