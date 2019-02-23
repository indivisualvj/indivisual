{
    class Plugin extends HC.MaterialMapPlugin {

        apply(i) {
            var seq = sourceman.getSequence(i);
            var image = seq.current(renderer.current(), true);

            if (image) {
                if (!this.texture) {
                    this.initTexture(image);
                }

                var map = this.texture;
                this.updateTexture(map, image);

                return image._color;

            } else {
                this.reset();
            }

            return false;
        }

        updateTexture(map, image) {
            var img = map.image;
            if (img) {
                var width = map.image.width;
                var height = map.image.height;
                if (img._ctx) {
                    img._ctx.clearRect(0, 0, width, height);
                    img._ctx.drawImage(image, img._clipX, img._clipY, width, height, 0, 0, width, height);
                }
                img._color = image._color;
            }
            map.needsUpdate = true;
        }

        initTexture(image) {
            var edge = Math.min(image.width, image.height);
            var nearest = THREE.Math.floorPowerOfTwo(edge);
            while (nearest > edge) {
                nearest /= 2;
                nearest = THREE.Math.floorPowerOfTwo(nearest);
            }
            edge = nearest;

            var canvas = document.createElement('canvas');
            canvas.width = edge;
            canvas.height = edge;
            canvas._ctx = canvas.getContext('2d');
            canvas._clipX = (image.width - edge) / 2;
            canvas._clipY = (image.height - edge) / 2;

            var tex = new THREE.CanvasTexture(canvas);
            this.texture = tex;
        }
    }

    HC.plugins.material_map.sequence = Plugin;
}