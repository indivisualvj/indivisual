/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {LightingTypePlugin} from "../LightingTypePlugin";
import {Mesh, MeshBasicMaterial, PointLight, SphereBufferGeometry} from "three";

class star extends LightingTypePlugin {
    create() {
        let light = new PointLight(0xffffff);
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.far = 10000;

        let sphere = new SphereBufferGeometry(this.layer.shapeSize(.5), 16, 16);
        let material = new MeshBasicMaterial({color: 0xffffff});
        material.color = light.color;
        let mesh = new Mesh(sphere, material);
        light.add(mesh);

        return light;
    }

    update(light) {
        super.update(light);

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

export {star};
