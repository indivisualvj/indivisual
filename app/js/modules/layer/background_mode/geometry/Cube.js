/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {GeometryBackgroundModePlugin} from "../GeometryBackgroundModePlugin";
import {BoxBufferGeometry, Color, DoubleSide, Mesh, MeshPhysicalMaterial} from "three";

class cube extends GeometryBackgroundModePlugin {
        static index = 50;

        apply() {
            if (this.needsUpdate()) {
                this.current(this.id());

                let color = new Color(this.settings.background_color);
                let res = this.layer.resolution().clone();
                res.multiplyScalar(2.5);
                let geo = new BoxBufferGeometry(res.x, res.y, res.x);
                this.geometry = geo;

                let mat = new MeshPhysicalMaterial({
                    color: color,
                    side: DoubleSide
                });
                this.material = mat;

                let mesh = new Mesh(geo, mat);
                mesh.scale.multiplyScalar(this.settings.background_volume);
                mesh.scale.x *= -1;
                mesh.receiveShadow = true;
                this.mesh = mesh;

                this.layer.setBackground(mesh);

                let file = this.config.getAssetManager().getImage(this.settings.background_input);
                if (file) {
                    this.config.getAssetManager().loadMaterialMap(mat, filePath(IMAGE_DIR, file), function (mat) {
                        if (!mat.emissiveMap) {
                            mat.emissiveMap = mat.map;
                        }
                        mat.needsUpdate = true;
                    });
                }
            }
        }
    }

export {cube};
