
{
    HC.plugins.override_material_input.sequence = class Plugin extends HC.OverrideMaterialInputPlugin {

        apply(i) {
            let seq = this.sourceManager.getSequence(i);
            let image = seq.current(this.sourceManager.getSourcePlugin('renderer').current(), true);

            if (image) {
                if (!this.properties.map) {
                    this.initTexture(image);
                }

                let map = this.properties.map;
                this.updateTexture(map, image);

                return image._color;

            } else {
                this.reset();
            }

            return false;
        }

        /**
         *
         * @param map {THREE.Texture}
         * @param image
         */
        updateTexture(map, image) {
            let img = map.image;
            if (img) {
                let width = map.image.width;
                let height = map.image.height;
                if (this.context) {
                    this.context.clearRect(0, 0, width, height);
                    this.context.drawImage(image, this.clip.x, this.clip.y, this.clip.width, this.clip.height, 0, 0, width, height);
                }
                img._color = image._color;
            }
            super.updateTexture(map, 'material');
            map.needsUpdate = true;
        }

        /**
         *
         * @param image
         */
        initTexture(image) {
            let width = image.width;
            let height = image.height

            if (this.enableCropping) {
                width = height = Math.min(image.width, image.height);
            }

            let canvas = new OffscreenCanvas(width, height);
            canvas.width = width;
            canvas.height = height;
            this.canvas = canvas;
            this.context = canvas.getContext('2d');

            let offsetX = .5 * (this.width - width);
            let offsetY = .5 * (this.height - height);

            this.clip = {
                x: offsetX,
                y: offsetY,
                width: width,
                height: height,
            };

            let tex = new THREE.CanvasTexture(canvas);
            this.properties.map = tex;
            this.properties.emissiveMap = tex;
        }
    }
}
