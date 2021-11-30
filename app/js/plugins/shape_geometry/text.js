{
    let coolvetica = false;

    _importThreeGeometry('TextGeometry');

    HC.plugins.shape_geometry.text = class Plugin extends HC.ShapeGeometryPlugin {
        static name = 'text (coolvetica)';

        create() {
            let geometry;

            if (this.ready()) {
                geometry = new THREE.TextGeometry(this.settings.shape_vertices || 'indivisual', {
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
            assetman.loadFont(HC.filePath(FONT_DIR, 'coolvetica.json'), function (font) {
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
}