/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";

class ring extends ShapeGeometryPlugin {
        static index = 30;
        static tutorial = {
            shape_moda: {
                text: 'set number of edges',
            },
            shape_modb: {
                text: 'set the initial direction of the shape (shape_modb x 360/shape_moda/2 = degrees)'
            },
            shape_modc: {
                text: 'set number of stepped overlapping shapes'
            },
        };

        create() {
            let layer = this.layer;

            let edges = this.getModA(3, 3);
            let dir = this.getModB(0, 0);
            let div = this.getModC(1, 1);
            let step = layer.shapeSize(.5) / div;
            let hstep = step / 2;

            let geometries = [];
            for (let i = step; i <= layer.shapeSize(.5); i += step) {
                let circ = new HC.DirectionalRing({
                    innerRadius: i - hstep,
                    outerRadius: i,
                    edges: edges,
                    direction: dir
                }).create();
                geometries.push(circ);
            }

            return THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
        }
    }

export {ring};
