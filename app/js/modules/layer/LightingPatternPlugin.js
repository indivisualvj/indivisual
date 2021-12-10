/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class LightingPatternPlugin extends HC.AnimationPlugin {

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.lighting_pattern.properties;
    }

    centerVector() {
        let v = this.layer.cameraDefaultDistance();
        return new THREE.Vector3(
            v * this.settings.lighting_pattern_centerx,
            v * this.settings.lighting_pattern_centery,
            v * this.settings.lighting_pattern_centerz
        );
    }

    positionIn2dSpace(light, x, y, z) {
        let cp = new THREE.Vector3(x, y, z);
        cp.applyEuler(new THREE.Euler(0, 0, -this.settings.lighting_pattern_rotation * 90 * RAD));
        cp.add(this.centerVector());
        light.position.copy(cp);
    }
}

export {LightingPatternPlugin};
