/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {DisplaySourcePlugin} from "../DisplaySourcePlugin";
import {WebGLRenderer} from "three";

class Perspective extends DisplaySourcePlugin
{
    static index = 30;

    /**
     * @type {WebGLRenderer}
     */
    threeRenderer;

    /**
     *
     * @type {string}
     */
    type = 'perspective';

    /**
     *
     * @param index
     */
    init(index) {
        super.init(index);
        this._bounds = null;
        this._last = 0;

        this.threeRenderer = new WebGLRenderer({alpha: true, antialias: ANTIALIAS});
        this.threeRenderer.view = this.threeRenderer.domElement;
        this.threeRenderer.view.id = this.id;
    }

    /**
     *
     * @param width
     * @param height
     */
    update(width, height) {
        this.width = width;
        this.height = height;
        this.threeRenderer.setSize(this.width, this.height);
    }

    /**
     *
     * @param fallback
     * @returns {*}
     */
    current(fallback) {
        this.next();
        return this.threeRenderer.view;
    }

    /**
     *
     */
    next() {
        if (this._last !== this.animation.now) {
            let key = this.id;
            let layer = this.animation.renderer.currentLayer;
            let three = layer.three;
            let cam = this.animation.renderer.three[key];
            if (cam) {
                let lcam = three.camera;
                cam.position.x = lcam.position.x;
                cam.position.y = lcam.position.y;
                cam.position.z = lcam.position.z;
                cam.rotation.x = lcam.rotation.x;
                cam.rotation.y = lcam.rotation.y + this.config.DisplaySettings[key + '_angle'] * RAD;
                cam.rotation.z = lcam.rotation.z;
                cam.fov = lcam.fov * this.config.DisplaySettings[key + '_fov'];
                cam.zoom = lcam.zoom * this.config.DisplaySettings[key + '_zoom'];

                cam.updateProjectionMatrix();

                this.threeRenderer.render(three.scene, cam);
            }
            this._last = this.animation.now;
        }
    }
}

export {Perspective};
