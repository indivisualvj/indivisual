/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {_Layer} from "./PluginLayer";
import * as HC from "../../shared/Three";
import {AmbientLight, Color, Fog, Group, Object3D, Texture} from "three";

class Layer extends _Layer {


    /**
     *
     * @returns {PerspectiveCamera}
     */
    getCamera() {
        return this.three.camera;
    }

    /**
     *
     */
    updateCameraFov() {
        let cam = this.getCamera();
        let sina = sinAlpha(this.resolution('half').y * 1.015, this.cameraDefaultDistance());

        cam.fov = sina * this.config.DisplaySettings.fov;
    }

    /**
     *
     * @param [multiplier]
     * @returns {number}
     */
    cameraDefaultDistance(multiplier) {
        return this.resolution().length() * (multiplier || 1);
    }
    /**
     *
     * @param value
     */
    setBackground(value) {

        this._resetBackground(false);

        if (value instanceof Object3D) {
            this._resetBackground(true);
            this._background.add(value);
        }
        if (value instanceof Color || value instanceof Texture) {
            this._layer.background = value;
        }
    }

    /**
     *
     * @param value
     */
    setBackgroundVisible(value) {
        if (!value && this._layer.background) {
            this._hiddenBackgroundTexture = this._layer.background;
            this._layer.background = null;

        } else if (value && this._hiddenBackgroundTexture) {
            this._layer.background = this._hiddenBackgroundTexture;
            this._hiddenBackgroundTexture = null;

        } else if (this._background) {
            this._background.visible = value;
        }
    }

    /**
     *
     * @param recreate
     * @protected
     */
    _resetBackground(recreate) {
        if (this._background) {
            this._layer.remove(this._background);
            this._background.traverse(HC.dispose);
        }

        this._hiddenBackgroundTexture = null;
        this._layer.background = null;

        if (recreate !== false) {
            this._background = new Group();
            this._background.position.x = this.resolution('half').x;
            this._background.position.y = -this.resolution('half').y;
            this._background.name = '_background' + this.index;
            this._layer.add(this._background);
        }
    }

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
}

export {Layer as _Layer}