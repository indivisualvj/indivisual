HC.plugins.shaders = HC.plugins.shaders || {};

HC.ShaderPlugin = _class(false, HC.Plugin, {
    create: function () {
        console.error('HC.ShaderPlugin: .create() must be implemented in derived plugin.');
    },

    updateResolution: function () {
        if (this.pass && this.pass.uniforms && this.pass.uniforms.resolution) {
            this.pass.uniforms.resolution.value.x = this.layer.resolution().x;
            this.pass.uniforms.resolution.value.y = this.layer.resolution().y;
        }
    },

    dispose: function () {
        if (this.pass) {
            if (this.pass.dispose) {
                this.pass.dispose();
                _log(this.key, 'pass.dispose', false, DEBUG);
            }
            if (this.pass.material) {
                _log(this.key, 'pass.material.dispose', false, DEBUG);
                this.pass.material.dispose();
            }
            if (this.pass.quad) {
                _log(this.key, 'pass.quad.geometry.dispose', false, DEBUG);
                this.pass.quad.geometry.dispose();
            }
            if (this.pass.overrideMaterial) {
                _log(this.key, 'pass.overrideMaterial.dispose', false, DEBUG);
                this.pass.overrideMaterial.dispose();
            }
        }
    },

    apply: function (key, sh) {
        var dependencies = this.dependencies;
        var glsh = this.pass;
        var name = this.key;
        sh = sh || this.settings.shaders[name];

        if (sh.random) {
            if ((audioman.isActive() && audio.peak && randomBool(3)) || (this.layer.getCurrentSpeed().prc == 0 && randomBool())) {
                glsh.enabled = !glsh.enabled;
            }
        } else {
            glsh.enabled = true;
        }

        if (!glsh.enabled) {
            return false;
        }

        for (var skey in sh) {
            var shs = sh[skey];

            if (typeof shs != 'boolean' && typeof shs != 'number') {

                if ('value' in shs) {
                    var v = shs.value;

                    if (shs.type == 'sampler2D') {
                        var img = statics.overlay_one ? statics.overlay_one.target : false;
                        if (img) {
                            v = statics.overlay_one.target;
                            glsh.uniforms[skey + '_ready'].value = 1;

                        } else {
                            glsh.uniforms[skey + '_ready'].value = 0;
                        }
                    } else {
                        if (shs.oscillate && shs.oscillate != 'off') {

                            var plugin = this.layer.getOscillatePlugin(shs.oscillate);
                            if (plugin) {
                                var allown = shs._type[0] < 0;

                                plugin.store(shs);

                                plugin.apply(shs);
                                v = shs.value;
                                if (allown === false) {
                                    v = Math.abs(v);
                                }

                                if (shs.stepwise && isInteger(shs._type[2])) {
                                    v = round(v, 0);
                                }

                                plugin.restore(shs);
                            }
                        }

                        if (audioman.isActive() && shs.audio) {

                            if (shs._type && isInteger(shs._type[2])) {

                                if (audio.peak && randomBool()) {
                                    if (dependencies && dependencies[skey]) { // is in dependency
                                        var dpc = dependencies[skey];

                                        if (dependencies[dpc]) { // is linked to dep
                                            var dpck = dpc;
                                            dpc = dependencies[dpck]; // get linked dep
                                            var rv = glsh.uniforms[dpck].value; // get current value from dep
                                            if (dpc[rv]) { // check if linked dep contains current dep
                                                dpc = dpc[rv]; // get valid values for skey from dep
                                                var dky = Object.keys(dpc);
                                                v = dky[randomInt(0, dky.length - 1)]; // random from valid values

                                            } else { // fallback
                                                v = randomInt(shs._type[0], shs.value);
                                            }

                                        } else {
                                            var dky = Object.keys(dpc);
                                            v = dky[randomInt(0, dky.length - 1)]; // random from valid values

                                        }

                                    } else {
                                        v = randomInt(shs._type[0], shs.value);
                                    }

                                } else {
                                    v = null;
                                }

                            } else {
                                v *= audio.volume;
                            }
                        }
                    }

                    // finalize
                    if (v !== null) {

                        if (shs._func) {

                            if (v < shs._type[0]) {
                                v = shs._type[0] + v;
                            }

                            var nv = this[shs._func](v);
                            v = nv;
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
                     return this.apply(skey, shs);
                }
            }
        }

        return true;
    }
});