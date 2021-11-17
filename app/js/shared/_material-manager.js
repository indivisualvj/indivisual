/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.MaterialManager}
     */
    HC.MaterialManager = class MaterialManager {
        materials = [];

        /**
         *
         */
        constructor() {
        }

        addMaterial(material) {
            this.materials.push(material);

            return material;
        }

        // todo: when to call it?
        disposeAll() {
            for (let i = 0; i < this.materials.length; i++) {
                requestAnimationFrame(() => {
                    console.log('dispose loaded material', this.materials[i].uuid);
                    this.materials[i].dispose();
                });
                this.materials[i] = null;
            }

            this.materials = [];
        }

    }
}
