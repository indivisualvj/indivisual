{
    HC.plugins.override_material_input.sequence = class Plugin extends HC.OverrideMaterialInputPlugin {

        apply(i) {
            let seq = this.animation.sourceManager.getSequence(i);
            let image = seq.current(this.layer.renderer.current(), true);

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
            let edge = Math.min(image.width, image.height);
            // let nearest = THREE.Math.floorPowerOfTwo(edge);
            // while (nearest > edge) {
            //     nearest /= 2;
            //     nearest = THREE.Math.floorPowerOfTwo(nearest);
            // }
            // edge = nearest;

            let canvas = new OffscreenCanvas(edge, edge);
            canvas.width = edge;
            canvas.height = edge;
            this.context = canvas.getContext('2d');

            let offsetX = .5 * (image.width - edge);
            let offsetY = .5 * (image.height - edge);

            this.clip = {
                x: offsetX,
                y: offsetY,
                width: edge,
                height: edge
            };

            let tex = new THREE.CanvasTexture(canvas);
            this.properties.map = tex;
            this.properties.emissiveMap = tex;
        }
    }
}
