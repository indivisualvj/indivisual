/**
 * @author indivisualvj / https://github.com/indivisualvj
 */


// todo AssetManager
class AssetManager {

    /**
     *
     * @param files
     */
    constructor (files) {
        this.files = files;
        this.images;
        this.videos;
        this.fonts;
    }

    /**
     *
     * @returns {{}|*}
     */
    getImages () {
        if (!this.images) {
            this.images = this.getFiles(/\.png/);
        }
        
        return this.images;
    }

    /**
     *
     * @param regexp
     */
    getFiles(regexp) {
        var files = {};
        for (var i = 0; i < this.files.length; i++) {
            var f = this.files[i];

            if (!regexp || !f.name.match(regexp)) {
                files[f.name] = f.name;
            }
        }

        return files;
    }

}