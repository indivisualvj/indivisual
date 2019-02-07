/**
 * @author Benjamin Lutze
 */

(function () {
    HC.TextureManager = function () {
        this.textures = {};
        this.renderTexture = false;
    };

    HC.TextureManager.prototype = {

        add: function (canvas, copy) {

            this.remove(canvas.id);

            if (copy) { /** !!!SLOW!!! **/
                var cpcnvs = document.createElement('canvas');
                var ctx = cpcnvs.getContext('2d');
                cpcnvs.width = canvas.width;
                cpcnvs.height = canvas.height;
                ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
                cpcnvs.id = canvas.id;
                canvas = cpcnvs;
            }
            var tx = new THREE.CanvasTexture(canvas, undefined, undefined, undefined, undefined, THREE.NearestFilter);
            this.textures[canvas.id] = tx;

            return this.textures[canvas.id];
        },

        get: function (id) {
            if (this.textures[id]) {
                return this.textures[id];
            }

            return false;
        },

        remove: function (id) {
            if (this.textures[id]) {
                var tex = this.textures[id];
                tex.dispose();
                this.textures[id] = false;

                return true;
            }

            return false;
        }

    };
})();