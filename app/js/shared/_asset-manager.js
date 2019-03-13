/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

var HC = HC || {};
{ // Hidden class to be added to HC via ... = class ...

    var inst;
    /**
     *
     */
    HC.AssetManager = class AssetManager {

        /**
         *
         * @param files
         */
        constructor() {
            inst = this;
            this.files = {};
            this.images = {};
            this.cubes = {};
            this.videos = {};
            this.fonts = {};
            this.textures = {};
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
         * @param file
         * @param onload
         */
        loadFont(file, onload) {
            if (this.fonts[file]) {
                onload(this.fonts[file]);

            } else {
                new THREE.FontLoader().load(file, function (font) {
                    inst.fonts[file] = font;
                    onload(font);
                });
            }
        }

        /**
         *
         * @param file
         * @param onload
         */
        loadTexture(file, onload) {
            if (this.textures[file]) {
                onload(this.textures[file]);

            } else {
                new THREE.TextureLoader().load(file, function (texture) {
                    inst.textures[file] = texture;
                    onload(texture);
                });
            }
        }

    }
}