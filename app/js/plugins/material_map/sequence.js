{
    HC.plugins.material_map.sequence = class Plugin extends HC.MaterialMapPlugin {

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

        updateTexture(map, image) {
            let img = map.image;
            if (img) {
                let width = map.image.width;
                let height = map.image.height;
                if (img._ctx) {
                    img._ctx.clearRect(0, 0, width, height);
                    img._ctx.drawImage(image, img._clipX, img._clipY, width, height, 0, 0, width, height);
                }
                img._color = image._color;
            }
            super.updateTexture(map, 'material');
            map.needsUpdate = true;
        }

        initTexture(image) {
            let edge = Math.min(image.width, image.height);
            let nearest = THREE.Math.floorPowerOfTwo(edge);
            while (nearest > edge) {
                nearest /= 2;
                nearest = THREE.Math.floorPowerOfTwo(nearest);
            }
            edge = nearest;

            let canvas = new OffscreenCanvas(edge, edge);//document.createElement('canvas');  // fixme try transferToOffline?
            canvas.width = edge;
            canvas.height = edge;
            canvas._ctx = canvas.getContext('2d');
            canvas._clipX = (image.width - edge) / 2;
            canvas._clipY = (image.height - edge) / 2;

            let tex = new THREE.CanvasTexture(canvas);
            this.properties.map = tex;
            this.properties.emissiveMap = tex;
        }
    }
}
