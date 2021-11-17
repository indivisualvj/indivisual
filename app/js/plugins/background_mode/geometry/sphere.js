/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.plugins.background_mode.sphere = class Plugin extends HC.GeometryBackgroundModePlugin {
        static index = 51;

        apply() {
            if (this.current() !== this.id()) {
                this.current(this.id());

                let color = new THREE.Color(this.settings.background_color);
                let res = this.layer.resolution().clone();
                res.multiplyScalar(this.settings.background_volume);
                let geo = new THREE.SphereBufferGeometry(res.length() * 2, 16, 16);
                geo.rotateY(Math.PI / 2);
                this.geometry = geo;

                this.material = materialman.addMaterial(new THREE.MeshPhysicalMaterial({
                    color: color,
                    side: THREE.DoubleSide
                }));

                let mesh = new THREE.Mesh(geo, this.material);
                mesh.receiveShadow = true;
                this.mesh = mesh;

                this.layer.setBackground(mesh);

                let file = assetman.getImage(this.settings.background_input);
                if (file) {
                    assetman.loadMaterialMap(this.material, filePath(IMAGE_DIR, file), function (mat) {
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
