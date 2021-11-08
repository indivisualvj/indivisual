{
    HC.plugins.lighting_type.star = class Plugin extends HC.LightingTypePlugin {
        create() {
            let light = new THREE.PointLight(0xffffff);
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;
            light.shadow.camera.far = 10000;

            let sphere = new THREE.SphereBufferGeometry(this.layer.shapeSize(.5), 16, 16);
            let material = materialman.addMaterial(new THREE.MeshBasicMaterial({color: 0xffffff}));
            materialman.addMaterial(material);
            material.color = light.color;
            let mesh = new THREE.Mesh(sphere, material);
            light.add(mesh);

            return light;
        }

        update(light) {
            HC.LightingTypePlugin.prototype.update.call(this, light);

            for (let c in light.children) {
                let child = light.children[c];
                if (child.scale) {
                    let s = this.settings.lighting_intensity / 2;
                    child.scale.x = s;
                    child.scale.y = s;
                    child.scale.z = s;
                }
            }
        }
    }
}
