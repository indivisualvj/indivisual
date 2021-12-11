/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {_Layer} from "./DoingLayer";
import * as HC from "../../shared/Three";
import {AmbientLight, Fog, Group, Color} from "three";

class LightingLayer extends _Layer {

    /**
     *
     * @protected
     */
    _resetLighting() {

        this.lightingNeedsReset = false;

        if (this._lighting) {
            this._layer.remove(this._lighting);
            this._lighting.traverse(HC.dispose);
        }

        this._lighting = new Group();
        this._lighting.position.x = this.resolution('half').x;
        this._lighting.position.y = -this.resolution('half').y;
        this._lighting.name = '_lighting' + this.index;
        this._layer.add(this._lighting);

        this._resetAmbientLight();
        this._resetFog();

        let plugin = this.getLightingTypePlugin();

        this.lights = [];
        for (let i = 0; i < this.settings.lighting_pattern_lights; i++) {
            let light = plugin.apply(i);
            if (light) {
                if (plugin.after) {
                    plugin.after(light);
                }

                this._lighting.add(light);
                this.lights.push(light);
            }
        }
    }

    /**
     *
     * @param value
     * @protected
     */
    _lightColor(value) {

        if (this.lights.length) {
            let c = new Color(value);

            if (c.r === 0 && c.g === 0 && c.b === 0) { // is black. change to white.
                c = new Color(0xffffff);
            }

            for (let k in this.lights) {
                this.lights[k].color.set(c);
            }
        }
    }

    /**
     *
     * @protected
     */
    _updateLighting() {

        if (this.three.scene.fog) {
            this.three.scene.fog.near = this.settings.lighting_fog_near;
            this.three.scene.fog.far = this.settings.lighting_fog_far;
        }

        if (this.ambientLight) {
            this.ambientLight.intensity = this.settings.lighting_ambient_intensity;
        }

        let pattern = this.getLightingPatternPlugin();
        let lookat = this.getLightingLookatPlugin();
        let type = this.getLightingTypePlugin();
        for (let k in this.lights) {
            let light = this.lights[k];

            this.doPlugin(pattern, light);
            this.doPlugin(lookat, light);
            type.update(light);
        }
    }

    /**
     *
     * @protected
     */
    _resetFog() {

        this.fogNeedsReset = false;

        if (this.three.scene.fog) {
            this._layer.fog = null;
        }

        if (this.settings.lighting_fog) {
            this._layer.fog = new Fog(0x000000, this.settings.lighting_fog_near, this.settings.lighting_fog_far);
        }
    }

    /**
     *
     * @protected
     */
    _resetAmbientLight() {

        this.ambientNeedsReset = false;

        if (this.ambientLight) {
            this._lighting.remove(this.ambientLight);
            this.ambientLight.traverse(HC.dispose);
            this.ambientLight = null;
        }

        if (this.settings.lighting_ambient) {
            let light = new AmbientLight(0xffffff);
            this._lighting.add(light);
            this.ambientLight = light;
        }
    }

    /**
     *
     * @protected
     */
    hasLighting() {
        return this.lights.length || this.ambientLight;
    }
}

export {LightingLayer as _Layer}