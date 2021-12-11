/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {LightingTypePlugin} from "../LightingTypePlugin";
import {SpotLight} from "three";

class spot extends LightingTypePlugin {
    create() {
        let light = new SpotLight(0xffffff);
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.fov = 90;
        light.shadow.camera.far = 10000;
        return light;
    }
}

export {spot};
