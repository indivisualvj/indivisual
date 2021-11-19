/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.plugins.background_mode.cube = class Plugin extends HC.GeometryBackgroundModePlugin {
        static index = 50;

        apply() {
            if (this.needsUpdate()) {
                this.current(this.id());

                let color = new THREE.Color(this.settings.background_color);
                let res = this.layer.resolution().clone();
                res.multiplyScalar(2.5);
                let geo = new THREE.BoxBufferGeometry(res.x, res.y, res.x);
                this.geometry = geo;

                let mat = new THREE.MeshPhysicalMaterial({
                    color: color,
                    side: THREE.DoubleSide
                });
                this.material = mat;

                let mesh = new THREE.Mesh(geo, mat);
                mesh.scale.multiplyScalar(this.settings.background_volume);
                mesh.scale.x *= -1;
                mesh.receiveShadow = true;
                this.mesh = mesh;

                this.layer.setBackground(mesh);

                let file = assetman.getImage(this.settings.background_input);
                if (file) {
                    assetman.loadMaterialMap(mat, HC.filePath(IMAGE_DIR, file), function (mat) {
                        if (!mat.emissiveMap) {
                            mat.emissiveMap = mat.map;
                        }
                        mat.needsUpdate = true;
                    });
                }
            }
        }
    }
}
