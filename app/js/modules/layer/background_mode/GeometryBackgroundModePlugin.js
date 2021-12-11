/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {BackgroundModePlugin} from "./BackgroundModePlugin";

class GeometryBackgroundModePlugin extends BackgroundModePlugin {
        mesh;
        material;
        geometry;

        after() {
            if (!super.after() && this.mesh && this.mesh.material) {
                let mat = this.mesh.material;
                let keys = Object.keys(mat);
                for (let k in keys) {
                    let key = keys[k];
                    if (mat[key] instanceof THREE.Texture) {
                        let texture = mat[key];
                        this.updateTexture(texture, 'background');
                    }
                }
            }
        }

        _dispose() {
            HC.traverse(this);
        }
    }

export {GeometryBackgroundModePlugin};