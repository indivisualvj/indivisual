/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
var HC = HC || {};
{

    let inst;
    /**
     *
     * @type {HC.AssetManager}
     */
    HC.AssetManager = class AssetManager {
        images = {};
        cubes = {};
        videos = {};

        /**
         *
         */
        constructor() {
            inst = this;
        }

        /**
         *
         * @param nu
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
            var filtered = {};
            for (var i in source) {
                var f = source[i];

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
            for (var i in nu) {
                var f = nu[i];
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
            new THREE.TextureLoader().load(url, function (tex) {
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
            this._files(url, function (data) {

                let images = [];
                for (let k in data) {
                    images.push(data[k].name);
                }

                let order = ['posx', 'px', 'negx', 'nx', 'posy', 'py', 'negy', 'ny', 'posz', 'pz', 'negz', 'nz'];
                images.sort(function (a, b) {
                    var na = a.replace(/\.[^/.]+$/, "");
                    var nb = b.replace(/\.[^/.]+$/, "");

                    let ia = order.indexOf(na);
                    let ib = order.indexOf(nb);

                    if (ia > -1 && ib > -1) {
                        return ia - ib;
                    }

                    return a.localeCompare(b);
                });

                new THREE.CubeTextureLoader().setPath(filePath(url, '')).load(images, function (tex) {
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
            this._files(url, function (data) {

                let files = [];
                for (let k in data) {
                    files[data[k].name] = data[k].name;
                }

                let config = files['config.json'];
                if (config) {
                    config = filePath(url, config);
                    inst._load(config, function (data) {
                        let json = JSON.parse(data.contents);
                        let keys = Object.keys(json);
                        let material = {};
                        let i = 0;

                        let _load = function (key) {

                            if (!key) {
                                callback(material);

                            } else {
                                let val = json[key];
                                if (isString(val)) {
                                    inst.loadTexture(filePath(url, val), function (tex) {
                                        material[key] = tex;
                                        tex.name = val;
                                        _load(keys[i++]);

                                    }, function (err) {
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
        loadMaterialMap(target, path, callback, error) {
            let _assign = function (to, from) {
                var keys = Object.keys(from);
                for (let k in keys) {
                    let key = keys[k];
                    if (key in to) {
                        to[key] = from[key];
                    }
                }
            };


            // complex
            if (path.match(/.+\.mat$/i)) {
                assetman.loadMaterial(path, function (mat) {

                    _assign(target, mat);
                    callback(target);

                }, error);

            // simple
            } else {
                assetman.loadTexture(path, function (tex) {
                    let mat = { map: tex };
                    _assign(target, mat);
                    callback(target);

                }, error);
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
            messaging._emit({action: 'get', file: file, name: file}, function (data) {
                callback(data);
            });
        }
    }
}