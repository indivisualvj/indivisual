/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";

let coolvetica = false;

class text extends ShapeGeometryPlugin {
    static name = 'text (coolvetica)';

    create() {
        let geometry;
        // fixme does not load zuverlässig after reload and even after reset layer only if re preset
        if (this.ready()) {
            geometry = new TextGeometry(this.settings.shape_vertices || 'indivisual', {
                font: coolvetica,
                size: this.layer.shapeSize(.19),
                curveSegments: this.getModA(1, 1, 12),
                bevelEnabled: this.settings.shape_modb,
                bevelThickness: this.getModB(1, 1),
                bevelSize: this.getModC(1, 1) / 8,
                bevelSegments: this.getModA(1, 1, 12)
            });
            geometry.center();

        } else {
            geometry = this.layer.getShapeGeometryPlugin('tile').create();

        }
        return geometry;
    }

    _loadCoolvetica() {
        this.config.getAssetManager().loadFont(filePath(FONT_DIR, 'coolvetica.json'), function (font) {
            coolvetica = font;
        });
    }

    ready() {
        if (!coolvetica) {
            this._loadCoolvetica();
        }
        return coolvetica;
    }
}

export {text};
