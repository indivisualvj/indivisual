/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {_Layer} from "./CameraLayer";
import {LayeredControlSetManager} from "../../manager/LayeredControlSetManager";

class Layer extends _Layer {

    /**
     *
     * @param shape
     */
    doPattern(shape) {
        let mover = this.getPatternMoverPlugin();
        if (mover && mover.before) {
            mover.before(shape);
        }

        let pattern = this.getPatternPlugin();
        this.doPlugin(pattern, shape);

        if (mover) {
            mover.apply(shape);
        }

        this.doOverlay(shape);
        this.doPairing(shape);

    }

    /**
     *
     * @param shape
     * @param v
     * @returns {number}
     */
    doRotationOffset(shape) {

        let plugin = this.getRotationOffsetModePlugin();
        this.doPlugin(plugin, shape);

    }

    /**
     *
     * @param shape
     */
    doPairing(shape) {
        let plugin = this.getShapePairingPlugin();
        this.doPlugin(plugin, shape);
    }

    /**
     *
     * @param shape
     */
    doOverlay(shape) {

        if (!shape.isVisible()) {
            return;
        }

        if (this.settings.pattern_overlay !== 'off'
            && this.settings.pattern_overlay_volume !== 0
        ) {

            let nu;
            let index = shape.index;

            if (this.shapeCache
                && this.shapeCache.length
                && this.settings.pattern_overlay in this.shapeCache[index]
            ) {
                nu = this.shapeCache[index][this.settings.pattern_overlay];

            } else {
                nu = this.nextShape(index, true);

                let speed = this.getShapeRhythmPlugin();
                let delay = this.shapeDelayPlugin();
                let direction = this.getRotationDirectionPlugin();
                speed.params(nu, speed.params(shape));
                delay.params(nu, delay.params(shape));
                direction.params(nu, direction.params(shape));

                if (this.shapeCache && this.shapeCache.length) {
                    this.shapeCache[index][this.settings.pattern_overlay] = nu;
                }
            }

            let plugin = this.getPatternOverlayPlugin();
            this.doPlugin(plugin, nu);

            if (this.settings.pattern_overlay_volume !== 1) {
                let fade = ((2 * Math.abs(this.settings.pattern_overlay_volume)) - 1);

                let dx = (nu.x() - shape.x()) / 2;
                let dy = (nu.y() - shape.y()) / 2;
                let dz = (nu.z() - shape.z()) / 2;

                dx += dx * fade;
                dy += dy * fade;
                dz += dz * fade;

                shape.move(dx, dy, dz);

            } else {
                shape.x(nu.x());
                shape.y(nu.y());
                shape.z(nu.z());
            }
        }
    }

    /**
     *
     * @returns {*}
     */
    doOverrideMaterialInput() {

        let seq = this.config.SourceSettings.override_material_input;
        let map = this.settings.material_input;
        let color = false;

        if (seq === 'webcam') {
            let plugin = this.getOverrideMaterialInputPlugin('webcam');
            color = this.doPlugin(plugin, map);

        } else if (seq !== 'none') {
            let plugin = this.getOverrideMaterialInputPlugin('sequence');
            color = this.doPlugin(plugin, parseInt(seq));

        } else {
            let plugin = this.getOverrideMaterialInputPlugin('texture');
            color = this.doPlugin(plugin, map);
        }

        return color;
    }


    /**
     *
     * @returns {*}
     */
    doOverrideBackgroundMode() {

        let seq = this.config.SourceSettings.override_background_mode;

        if (seq === 'webcam') {
            let plugin = this.getOverrideBackgroundModePlugin('webcam');
            this.doPlugin(plugin);

        } else if (seq !== 'none') {
            let plugin = this.getOverrideBackgroundModePlugin('sequence');
            plugin.setCropping(false);
            this.doPlugin(plugin, parseInt(seq));

        } else {
        }
    }

    /**
     *
     * @param shape
     */
    doColoring(shape) {

        let proceed = true;
        let filter = this.getFilterModePlugin();
        if (filter && filter.before) {
            proceed = filter.before(shape);
        }

        if (proceed !== false) {
            let coloring = this.getColoringModePlugin();
            proceed = this.doPlugin(coloring, shape);

            if (proceed !== false && filter && filter.apply) {
                proceed = filter.apply(shape);
                if (proceed !== false && filter.after) {
                    filter.after(shape);
                }
            }
        }
        let color = shape.color;
        let multiplier = this.settings.material_blending !== 'NoBlending' ? color.o : ((this.settings.coloring_opacity > .99) ? 1 : color.o);
        shape.opacity(multiplier * this.settings.coloring_opacity);

        return proceed;
    }

    /**
     *
     * @param shape
     */
    doMaterial(shape) {

        let style = this.getMaterialStylePlugin();
        this.doPlugin(style, shape);

        shape.strokeWidth(this.settings.material_volume);

        try {
            let map = this.getOverrideMaterialInput();
            shape.updateMaterial(map, this.settings.coloring_emissive);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     */
    doBackground() {
        let plugin = this.getBackgroundModePlugin();
        this.doPlugin(plugin);
    }

    /**
     *
     * @param materialColor
     */
    doLighting(materialColor) {
        if (materialColor || this.settings.lighting_color === '') {
            this._lightColor(materialColor || this.shapeColor(false));
        }
        this._updateLighting();
    }

    /**
     *
     * @param shape
     */
    doLockingShapeRotation(shape) {

        let roto = this.shape.rotation();
        let plugin = this.getPatternRotationPlugin();
        if (plugin.shared && plugin.shared.locking.disabled) {
            roto = plugin.getShapeEuler(shape);
        }

        let eu = {x: 0, y: 0, z: 0};

        if (this.settings.locking_shapex) {
            eu.x = roto.x * this.settings.locking_shapex_multiplier;
            shape.rotation().x = eu.x;
        }

        if (this.settings.locking_shapey) {
            eu.y = roto.y * this.settings.locking_shapey_multiplier;
            shape.rotation().y = eu.y;
        }

        if (this.settings.locking_shapez) {
            eu.z = roto.z * this.settings.locking_shapez_multiplier;
            shape.rotation().z = eu.z;
        }

    }

    /**
     *
     * @param shape
     */
    doShapeLookat(shape) {
        let plugin = this.getShapeLookatPlugin();
        this.doPlugin(plugin, shape);
    }

    /**
     *
     * @param shape
     */
    doSizing(shape) {

        let sizing = this.getSizingModePlugin();
        this.doPlugin(sizing, shape);

        let flip = this.getSizingFlipPlugin();
        this.doPlugin(flip, shape);

    }

    /**
     *
     * @param enable
     */
    doOscillate(enable) {
        let oscillator = LayeredControlSetManager.getAllOsciProperties();
        for (let i = 0; i < oscillator.length; i++) {
            let key = oscillator[i];
            let okey = key + '_oscillate';
            if (this.settings[okey] !== undefined) {
                let osci = this.settings[okey];
                if (osci in HC.plugins.oscillate) {
                    let plugin = this.getOscillatePlugin(osci);
                    if (plugin && plugin.apply) {
                        if (enable) {
                            plugin.store(key);
                            plugin.apply(key);

                        } else {
                            plugin.restore(key);
                        }
                    }
                }
            }
        }
    }

    /**
     *
     * @param shape
     */
    doShapeTransform(shape) {

        let plugin = this.getShapeTransformPlugin();
        this.doPlugin(plugin, shape);
    }

    /**
     *
     */
    doShaders() {

        let shaders = this.shaders();
        if (shaders) {
            let last;
            for (let i = 0; i < shaders.length; i++) {
                let plugin = shaders[i];
                if (plugin.apply(false, false)) {
                    last = plugin;
                }
                plugin.pass.renderToScreen = false;
            }

            if (last) {
                this.three.composer.passes[0].renderToScreen = false;
                last.pass.renderToScreen = true;
            } else {
                this.three.composer.passes[0].renderToScreen = true;
            }
        }
    }

    /**
     *
     * @param shape
     */
    doOffsetMode(shape) {

        let plugin = this.getOffsetModePlugin();
        this.doPlugin(plugin, shape);
    }

    /**
     *
     * @param plugin
     * @param params
     * @returns {*}
     */
    doPlugin(plugin, params) {

        let result = true;
        if (plugin && plugin.apply) {
            if (plugin.before) {
                if (params) {
                    result = plugin.before(params);
                } else {
                    result = plugin.before();
                }
            }

            if (result === false) {
                return false;
            }
            if (params !== undefined) {
                result = plugin.apply(params);

            } else {
                result = plugin.apply();
            }

            if (result === false) {
                return false;
            }

            if (plugin.after) {
                if (params) {
                    plugin.after(params);

                } else {
                    plugin.after();
                }
            }
        }

        return result;
    }

    /**
     *
     */
    doCameraMode() {
        let plugin = this.getCameraModePlugin();
        this.doPlugin(plugin);
    }

    /**
     *
     */
    doPatternRotation() {
        let plugin = this.getPatternRotationPlugin();
        this.doPlugin(plugin);
    }
}

export {Layer as _Layer}