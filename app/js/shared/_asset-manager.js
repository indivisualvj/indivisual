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
         */
        addImages(nu) {
            for (var i in nu) {
                this.images[i] = nu[i];
            }
        }

        /**
         *
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