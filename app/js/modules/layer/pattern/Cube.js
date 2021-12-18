/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";
import {Vector3} from "three";

class cube extends PatternPlugin {
    static name = 'cube';
    injections = {position: false};

    apply(shape) {
        let layer = this.layer;

        let edge = layer.resolution().y * this.settings.pattern_padding;
        let w = edge * this.settings.pattern_paddingx;
        let h = edge * this.settings.pattern_paddingy;
        let d = edge * this.settings.pattern_paddingz;
        let radius = 1;


        if (this.layer.shapeCount() < 7) {
            let x, y, z;
            switch (shape.index) {
                case 0:
                    x = 0;
                    y = 0;
                    z = d / 2;
                    break;
                case 1:
                    x = w / 2;
                    y = 0;
                    z = 0;
                    break;
                case 2:
                    x = 0;
                    y = 0;
                    z = -d / 2;
                    break;
                case 3:
                    x = -w / 2;
                    y = 0;
                    z = 0;
                    break;
                case 4:
                    x = 0;
                    y = -h / 2;
                    z = 0;
                    break;
                case 5:
                    x = 0;
                    y = h / 2;
                    z = 0;
                    break;
            }
            this.positionIn3dSpace(shape, x, y, z);

        } else {

            let shapesPerDimension = this.shapesPerDimension(layer);
            let position = this.cubePosition(shape);

            if (this.settings.pattern_audio) {
                let or = radius;
                if (this.settings.pattern_sync) {
                    radius *= this.audioAnalyser.volume;
                } else {
                    radius *= this.shapeVolume(shape);
                }
                if (this.settings.pattern_limit) {
                    radius = or + radius;
                }
            }

            let stepx = w / shapesPerDimension * radius;
            let stepy = h / shapesPerDimension * radius;
            let stepz = d / shapesPerDimension * radius;

            let x = (shapesPerDimension - 1) / -2 * stepx + position.x * stepx;
            let y = (shapesPerDimension - 1) / -2 * stepy + position.y * stepy;
            let z = (shapesPerDimension - 1) / -2 * stepz + position.z * stepz;

            this.positionIn3dSpace(shape, x, y, z);
        }
    }

    getDistributionOnCube(shapeCount, shapeIndex, vector) {
        let shapesPerDimension = Math.ceil(Math.pow(shapeCount, 1 / 3));

        let shapesPerLayer = Math.pow(shapesPerDimension, 2);

        let shapeLayerIndex = Math.floor(shapeIndex / shapesPerLayer);
        let shapesOnLayers = shapeLayerIndex * shapesPerLayer;
        let shapeIndexOnLayer = shapeIndex - shapesOnLayers;

        let shapeRowIndex = Math.floor(shapeIndexOnLayer / shapesPerDimension);
        let shapesOnRows = shapeRowIndex * shapesPerDimension;
        let shapeColumnIndex = shapeIndexOnLayer - shapesOnRows;

        vector.set(shapeColumnIndex, shapeRowIndex, shapeLayerIndex);
    }

    cubePosition(shape) {
        let params = this.params(shape);
        if (params.position === false) {

            params.position = new Vector3();
            this.getDistributionOnCube(this.layer.shapeCount(), shape.index, params.position);

        }

        return params.position;
    }

    shapesPerDimension() {
        return Math.ceil(Math.pow(this.layer.shapeCount(), 1 / 3));
    }
}

export {cube};
