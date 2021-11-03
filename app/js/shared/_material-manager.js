/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    let inst;
    /**
     *
     * @type {HC.GarbageCollector}
     */
    HC.GarbageCollector = class MaterialManager {
        materials = [];
        maxInstances = 10;

        /**
         *
         */
        constructor() {
            inst = this;
        }

        addMaterial(material) {
            // if (this.materials.length >= this.maxInstances) {
            //     let mat = this.materials.shift();
            //     threeDispose(mat);
            // }

            this.materials.push(material);

            return material;
        }

        disposeAll() {
            for (let i = 0; i < this.materials.length; i++) {
                this.materials[i].dispose();
                this.materials[i] = null;
            }

            this.materials = [];
        }

    }
}
