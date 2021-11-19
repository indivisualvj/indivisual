/**
 *
 * @private
 */
HC.Layer.prototype._resetLighting = function () {

    this.lightingNeedsReset = false;

    if (this._lighting) {
        this._layer.remove(this._lighting);
        this._lighting.traverse(HC.dispose);
    }

    this._lighting = new THREE.Group();
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
};

/**
 *
 * @param value
 * @private
 */
HC.Layer.prototype._lightColor = function (value) {

    if (this.lights.length) {
        let c = new THREE.Color(value);

        if (c.r === 0 && c.g === 0 && c.b === 0) { // is black. change to white.
            c = new THREE.Color(0xffffff);
        }

        for (let k in this.lights) {
            this.lights[k].color.set(c);
        }
    }
};

/**
 *
 * @private
 */
HC.Layer.prototype._updateLighting = function () {

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
};

/**
 *
 * @private
 */
HC.Layer.prototype._resetFog = function () {

    this.fogNeedsReset = false;

    if (this.three.scene.fog) {
        this._layer.fog = null;
    }

    if (this.settings.lighting_fog) {
        let fog = new THREE.Fog(0x000000, this.settings.lighting_fog_near, this.settings.lighting_fog_far);
        this._layer.fog = fog;
    }
};

/**
 *
 * @private
 */
HC.Layer.prototype._resetAmbientLight = function () {

    this.ambientNeedsReset = false;

    if (this.ambientLight) {
        this._lighting.remove(this.ambientLight);
        this.ambientLight.traverse(HC.dispose);
        this.ambientLight = false;
    }

    if (this.settings.lighting_ambient) {
        let light = new THREE.AmbientLight(0xffffff);
        this._lighting.add(light);
        this.ambientLight = light;
    }
};

/**
 *
 * @private
 */
HC.Layer.prototype.hasLighting = function () {
    return this.lights.length || this.ambientLight;
};
