/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.AssetManager}
     */
    HC.AssetManager = class AssetManager {
        images = {};
        cubes = {};
        videos = {};
        textures = {};
        progress = {};

        /**
         *
         */
        constructor() {
            if (IS_ANIMATION) {
                THREE.Cache.enabled = true;
            }
        }

        /**
         *
         * @param nu
         * @param key
         * @returns {*}
         */
        addImages(nu, key) {
            return this._add(this.images, nu, key);
        }

        /**
         *
         * @param regexp
         * @returns {{}|*}
         */
        getImages(regexp) {

            if (regexp) {
                return this._filter(this.images, regexp);
            }
            return this.images;
        }

        /**
         *
         * @param name
         * @returns {*}
         */
        getImage(name) {
            return this.images[name];
        }

        /**
         *
         * @param nu
         * @param key
         * @returns {*}
         */
        addCubes(nu, key) {
            return this._add(this.cubes, nu, key);
        }

        /**
         *
         * @param regexp
         * @returns {{}|*}
         */
        getCubes(regexp) {

            if (regexp) {
                return this._filter(this.cubes, regexp);
            }
            return this.cubes;
        }

        /**
         *
         * @param name
         * @returns {*}
         */
        getCube(name) {
            return this.cubes[name];
        }

        /**
         *
         * @param nu
         * @param key
         * @returns {*}
         */
        addVideos(nu, key) {
            return this._add(this.videos, nu, key);
        }

        /**
         *
         * @returns {{}|*}
         */
        getVideos(regexp) {

            if (regexp) {
                return this._filter(this.videos, regexp);
            }
            return this.videos;
        }

        /**
         *
         * @param name
         * @returns {*}
         */
        getVideo(name) {
            return this.videos[name];
        }

        /**
         *
         * @param source
         * @param regexp
         * @private
         */
        _filter(source, regexp) {
            let filtered = {};
            for (let i in source) {
                let f = source[i];

                if (!regexp || !f.name.match(regexp)) {
                    filtered[f.name] = f.name;
                }
            }

            return filtered;
        }

        /**
         *
         * @param source
         * @param nu
         * @param key
         * @returns {*}
         * @private
         */
        _add(source, nu, key) {
            for (let i in nu) {
                let f = nu[i];
                source[key ? f[key] : i] = key ? f[key] : f;
            }

            return source;
        }

        /**
         *
         * @param url
         * @param callback
         */
        loadFont(url, callback) {
            new THREE.FontLoader().load(url, function (font) {
                callback(font);
            });
        }

        /**
         *
         * @param url
         * @param callback
         * @param error
         */
        loadTexture(url, callback, error) {

            if (this._cacheGet(url, callback)) {
                return;
            }
            let progress = this._progressGet(url);
            this._progressSet(url, callback);

            if (progress) {
                // callback was exchanged and will be called instead
                return;
            }

            new THREE.TextureLoader().load(url, (tex) => {
                this._cacheSet(url, tex);
                callback = this._progressGet(url, true);
                callback(tex);
            }, false, error);
        }

        /**
         *
         * @param url
         * @param callback
         * @param error
         */
        loadCubeTexture(url, callback, error) {

            if (this._cacheGet(url, callback)) {
                return;
            }
            let progress = this._progressGet(url);
            this._progressSet(url, callback);

            if (progress) {
                // callback was exchanged and will be called instead
                return;
            }

            this._files(url, (data) => {

                let images = [];
                for (let k in data) {
                    images.push(data[k].name);
                }

                let order = ['posx', 'px', 'negx', 'nx', 'posy', 'py', 'negy', 'ny', 'posz', 'pz', 'negz', 'nz'];
                images.sort(function (a, b) {
                    let na = a.replace(/\.[^/.]+$/, "");
                    let nb = b.replace(/\.[^/.]+$/, "");

                    let ia = order.indexOf(na);
                    let ib = order.indexOf(nb);

                    if (ia > -1 && ib > -1) {
                        return ia - ib;
                    }

                    return a.localeCompare(b);
                });

                new THREE.CubeTextureLoader().setPath(filePath(url, '')).load(images, (tex) => {
                    this._cacheSet(url, tex);
                    callback = this._progressGet(url, true);
                    callback(tex);
                }, false, error);
            });
        }

        /**
         *
         * @param url
         * @param callback
         * @param error
         */
        loadMaterial(url, callback, error) {
            this._files(url, (data) => {

                let files = [];
                for (let k in data) {
                    files[data[k].name] = data[k].name;
                }

                let config = files['config.json'];
                if (config) {
                    config = filePath(url, config);
                    this._load(config, (data) => {
                        let json = JSON.parse(data.contents);
                        let keys = Object.keys(json);
                        let material = {};
                        let i = 0;

                        let _load = (key) => {

                            if (!key) {
                                callback(material);

                            } else {
                                let val = json[key];
                                if (isString(val)) {
                                    this.loadTexture(filePath(url, val), (tex) => {
                                        material[key] = tex;
                                        tex.name = val;
                                        _load(keys[i++]);

                                    }, function () {
                                        material[key] = undefined;
                                        _load(keys[i++]);
                                    });

                                } else {
                                    material[key] = val;
                                    _load(keys[i++]);
                                }
                            }
                        };

                        _load(keys[i++]);
                    });
                }
            });
        }

        /**
         *
         * @param target
         * @param path
         * @param callback
         * @param error
         */
        loadOverrideMaterialInput(target, path, callback, error) {
            let inst = this;
            let _assign = function (to, from) {
                let keys = Object.keys(from);
                for (let k in keys) {
                    let key = keys[k];
                    if (key in to) {
                        to[key] = from[key];
                    }
                }
            };

            // complex
            if (path.match(/.+\.mat$/i)) {
                this.loadMaterial(path, function (mat) {
                    _assign(target, mat);
                    callback(target);
                }, error);

            // simple
            } else {
                this.loadTexture(path, function (tex) {
                    let mat = { map: tex };
                    _assign(target, mat);
                    callback(target);

                }, error);
            }
        }

        disposeAll() {
            for (let i = 0; i < this.textures.length; i++) {
                this.textures[i].dispose();
            }
            this.progress = [];
            this.textures = [];

            if (IS_ANIMATION) {
                THREE.Cache.clear();
            }
        }

        /**
         *
         * @param path
         * @param callback
         * @private
         */
        _files(path, callback) {
            messaging.files(path, callback);
        }

        /**
         *
         * @param file
         * @param callback
         * @private
         */
        _load(file, callback) {
            messaging._emit({action: 'load', file: file, name: file}, function (data) {
                callback(data);
            });
        }

        /**
         *
         * @param url
         * @param callback
         * @returns {boolean|THREE.Texture}
         * @private
         */
        _cacheGet(url, callback) {
            if (url in this.textures) {
                let tex = this.textures[url];
                if (callback) {
                    callback(tex);
                    return true;
                }
                return tex;
            }

            return false;
        }

        /**
         *
         * @param url
         * @param tex
         * @private
         */
        _cacheSet(url, tex) {
            if (url in this.textures) {
                console.error('avoid adding duplicate urls', url);
                debugger; // maybe it was loaded twice but how?
            }
            this.textures[url] = tex;
        }

        /**
         *
         * @param url
         * @param remove
         * @returns {null|*}
         * @private
         */
        _progressGet(url, remove) {
            if (url in this.progress) {
                let progress = this.progress[url];
                if (remove) {
                    this._progressRemove(url);
                }

                return progress;
            }

            return null;
        }

        /**
         *
         * @param url
         * @param callback
         * @private
         */
        _progressSet(url, callback) {
            this.progress[url] = callback;
        }

        /**
         *
         * @param url
         * @private
         */
        _progressRemove(url) {
            delete this.progress[url];
        }
    }
}
