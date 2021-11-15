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

            return material;
        }

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
