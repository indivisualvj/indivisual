/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {Messaging} from "../shared/Messaging";
import {Cache, CubeTextureLoader, TextureLoader} from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";

class AssetManager {
    static images = {};
    static cubes = {};
    static videos = {};
    static textures = {};
    static progress = {};

    /**
     *
     */
    static init() {
        if (!IS_CONTROLLER) {
            Cache.enabled = true;
        }
    }

    /**
     *
     * @param nu
     * @param key
     * @returns {*}
     */
    static addImages(nu, key) {
        return this._add(this.images, nu, key);
    }

    /**
     *
     * @param regexp
     * @returns {{}|*}
     */
    static getImages(regexp) {

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
    static getImage(name) {
        return this.images[name];
    }

    /**
     *
     * @param nu
     * @param key
     * @returns {*}
     */
    static addCubes(nu, key) {
        return this._add(this.cubes, nu, key);
    }

    /**
     *
     * @param regexp
     * @returns {{}|*}
     */
    static getCubes(regexp) {

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
    static getCube(name) {
        return this.cubes[name];
    }

    /**
     *
     * @param nu
     * @param key
     * @returns {*}
     */
    static addVideos(nu, key) {
        return this._add(this.videos, nu, key);
    }

    /**
     *
     * @returns {{}|*}
     */
    static getVideos(regexp) {

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
    static getVideo(name) {
        return this.videos[name];
    }

    /**
     *
     * @param source
     * @param regexp
     * @private
     */
    static _filter(source, regexp) {
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
    static _add(source, nu, key) {
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
    static loadFont(url, callback) {
        new FontLoader().load(url, function (font) {
            callback(font);
        });
    }

    /**
     *
     * @param url
     * @param callback
     * @param error
     */
    static loadTexture(url, callback, error) {

        if (this._cacheGet(url, callback)) {
            return;
        }
        let progress = this._progressGet(url);
        this._progressSet(url, callback);

        if (progress) {
            // callback was exchanged and will be called instead
            return;
        }

        new TextureLoader().load(url, (tex) => {
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
    static loadCubeTexture(url, callback, error) {

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

            new CubeTextureLoader().setPath(filePath(url, '')).load(images, (tex) => {
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
    static loadMaterial(url, callback, error) {
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
    static loadMaterialMap(target, path, callback, error) {
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

    static disposeAll() {
        for (let i = 0; i < this.textures.length; i++) {
            this.textures[i].dispose();
        }
        this.progress = [];
        this.textures = [];

        if (IS_ANIMATION) {
            Cache.clear();
        }
    }

    /**
     *
     * @param path
     * @param callback
     * @private
     */
    static _files(path, callback) {
        Messaging.files(path, callback);
    }

    /**
     *
     * @param file
     * @param callback
     * @private
     */
    static _load(file, callback) {
        Messaging._emit({action: 'load', file: file, name: file}, function (data) {
            callback(data);
        });
    }

    /**
     *
     * @param url
     * @param callback
     * @returns {boolean|Texture}
     * @private
     */
    static _cacheGet(url, callback) {
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
    static _cacheSet(url, tex) {
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
    static _progressGet(url, remove) {
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
    static _progressSet(url, callback) {
        this.progress[url] = callback;
    }

    /**
     *
     * @param url
     * @private
     */
    static _progressRemove(url) {
        delete this.progress[url];
    }
}

export {AssetManager}