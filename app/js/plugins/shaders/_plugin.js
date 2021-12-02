/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

_importThreePostprocessing('Pass');
_importThreePostprocessing('RenderPass');
_importThreePostprocessing('ShaderPass');

HC.plugins.shaders = HC.plugins.shaders || {};

{
    HC.ShaderPlugin = class Plugin extends HC.AnimationPlugin {

        pass;

        create() {
            console.error('HC.ShaderPlugin: .create() must be implemented in derived plugin.');
        }

        updateResolution() {
            if (this.pass && this.pass.uniforms && this.pass.uniforms.resolution) {
                this.pass.uniforms.resolution.value.x = this.layer.resolution().x;
                this.pass.uniforms.resolution.value.y = this.layer.resolution().y;
            }
        }

        reset() {
            if (this.pass) {
                HC.traverse(this);
                HC.traverse(this.pass);
            }
        }

        apply(key, properties, settings) {
            let dependencies = this.dependencies;
            let glsh = this.pass;
            let name = this.key;
            properties = properties || this.settings.shaders[name];
            settings = settings || this.__proto__.constructor.settings;

            if (properties.random) {
                if ((this.animation.audioManager.isActive() && this.audioAnalyser.peak && randomBool(3)) || (this.layer.currentSpeed().prc === 0 && randomBool())) {
                    glsh.enabled = !glsh.enabled;
                }
            } else {
                glsh.enabled = true;
            }

            if (!glsh.enabled) {
                return false;
            }

            for (let skey in properties) {
                let sProperty = properties[skey];
                let sSetting = settings[skey];
                if (sSetting === undefined) {
                    continue;
                }
                if (typeof sProperty !== 'boolean' && typeof sProperty !== 'number') {

                    if ('value' in sProperty) {
                        let v = sProperty.value;

                        if (sSetting.type === 'sampler2D') {
                            let img = this.config.overlay_one ? this.config.overlay_one.target : false;
                            if (img) {
                                v = this.config.overlay_one.target;
                                glsh.uniforms[skey + '_ready'].value = 1;

                            } else {
                                glsh.uniforms[skey + '_ready'].value = 0;
                            }
                        } else {
                            if (sProperty.oscillate && sProperty.oscillate !== 'off') {

                                let plugin = this.layer.getOscillatePlugin(sProperty.oscillate);
                                if (plugin) {
                                    let allown = sSetting._type[0] < 0;

                                    plugin.store(sProperty);

                                    plugin.apply(sProperty);
                                    v = sProperty.value;
                                    if (allown === false) {
                                        v = Math.abs(v);
                                    }

                                    if (sProperty.stepwise && isInteger(sSetting._type[2])) {
                                        v = round(v, 0);
                                    }

                                    plugin.restore(sProperty);
                                }
                            }

                            if (this.animation.audioManager.isActive() && sProperty.audio) {

                                if (sSetting._type && isInteger(sSetting._type[2])) {

                                    if (this.audioAnalyser.peak && randomBool()) {
                                        if (dependencies && dependencies[skey]) { // is in dependency
                                            let dpc = dependencies[skey];

                                            if (dependencies[dpc]) { // is linked to dep
                                                let dpck = dpc;
                                                dpc = dependencies[dpck]; // get linked dep
                                                let rv = glsh.uniforms[dpck].value; // get current value from dep
                                                if (dpc[rv]) { // _check if linked dep contains current dep
                                                    dpc = dpc[rv]; // get valid values for skey from dep
                                                    let dky = Object.keys(dpc);
                                                    v = dky[randomInt(0, dky.length - 1)]; // random from valid values

                                                } else { // fallback
                                                    v = randomInt(sSetting._type[0], sProperty.value);
                                                }

                                            } else {
                                                let dky = Object.keys(dpc);
                                                v = dky[randomInt(0, dky.length - 1)]; // random from valid values

                                            }

                                        } else {
                                            v = randomInt(sSetting._type[0], sProperty.value);
                                        }

                                    } else {
                                        v = null;
                                    }

                                } else {
                                    v *= this.audioAnalyser.volume;
                                }
                            }
                        }

                        // finalize
                        if (v !== null) {

                            if (sSetting._func) {

                                if (v < sSetting._type[0]) {
                                    v = sSetting._type[0] + v;
                                }

                                v = this[sSetting._func](v);
                            }

                            if (glsh.uniforms) {
                                if (key && key in glsh.uniforms) {
                                    glsh.uniforms[key].value[skey] = v;

                                } else if (skey in glsh.uniforms) {
                                    glsh.uniforms[skey].value = v;

                                } else if (key in glsh) {
                                    glsh[key][skey] = v;
                                }

                            } else {
                                glsh[skey] = v;

                            }
                        }

                    } else { // one level deeper
                        this.apply(skey, sProperty, sSetting);
                    }
                }
            }

            return true;
        }
    }
}
