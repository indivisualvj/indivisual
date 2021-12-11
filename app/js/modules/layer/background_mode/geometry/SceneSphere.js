/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {GeometryBackgroundModePlugin} from "../GeometryBackgroundModePlugin";
import {DoubleSide, Mesh, MeshBasicMaterial, SphereBufferGeometry, WebGLRenderTarget} from "three";

class scenesphere extends GeometryBackgroundModePlugin {
        static index = 61;
        material;
        counter = 0;
        target1;
        target2;

        apply() {
            if (this.needsUpdate()) {
                this.current(this.id());

                let color = new Color(this.settings.background_color);
                let res = this.layer.resolution().clone();
                let edge = Math.min(res.x, res.y);

                let wraps = THREE[this.settings.background_wraps];
                let wrapt = THREE[this.settings.background_wrapt];
                this.target1 = new WebGLRenderTarget(edge, edge, {
                    wrapT: wrapt, wrapS: wraps
                });

                this.target2 = new WebGLRenderTarget(edge, edge, {
                    wrapT: wrapt, wrapS: wraps
                });

                let geo = new SphereBufferGeometry(res.length() * 2, 16, 16);
                geo.rotateY(Math.PI / 2);
                this.geometry = geo;

                this.material = new MeshBasicMaterial({
                    color: color,
                    side: DoubleSide,
                    map: this.target1.texture,
                    transparent: true
                });

                let mesh = new Mesh(geo, this.material);
                mesh.scale.multiplyScalar(this.settings.background_volume);
                mesh.scale.x *= -1;
                mesh.name = this.id();
                mesh.receiveShadow = true;
                this.mesh = mesh;

                this.layer.setBackground(mesh);

            } else {
                if (this.counter % 2) {
                    this.texture = this.target2.texture;
                    this.material.map = this.texture;

                    this.layer.three.renderer.setRenderTarget(this.target1);
                    this.layer.three.renderer.render(this.layer.three.scene, this.layer.three.camera);
                    this.layer.three.renderer.setRenderTarget(null);

                } else {
                    this.texture = this.target1.texture;
                    this.material.map = this.texture;

                    this.layer.three.renderer.setRenderTarget(this.target2);
                    this.layer.three.renderer.render(this.layer.three.scene, this.layer.three.camera);
                    this.layer.three.renderer.setRenderTarget(null);
                }

                this.counter ++;
            }
        }
    }

export {scenesphere};
