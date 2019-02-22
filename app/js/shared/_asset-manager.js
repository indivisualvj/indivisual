/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

var HC = HC || {};
{ // Hidden class to be added to HC namespace at [end of file]
    /**
     *
     */
    class AssetManager {

        /**
         *
         * @param files
         */
        constructor() {
            this.files = {};
            this.images = {};
            this.videos = {};
            this.fonts = {};
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
                source[key?f[key]:i] = key?f[key]:f;
            }

            return source;
        }

        /**
         *
         */
        loadFonts() {
            new THREE.FontLoader().load(filePath(FONT_DIR, 'coolvetica.json'), function (font) {
                statics.three.fonts.coolvetica = font;
            });
        }

        /**
         *
         */
        loadTextures() {
            new THREE.TextureLoader().load(filePath(TEXTURE_DIR, 'rgb-noise.png'), function (texture) {
                statics.three.textures.rgbnoise = texture;
            });
        }

    }

    // add hidden class to HC namespace
    HC.AssetManager = AssetManager;
}