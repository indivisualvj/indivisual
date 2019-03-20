/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @param mesh
     * @param index
     * @param color
     * @constructor
     */
    HC.Shape = class Shape {

        constructor(mesh, index, color) {
            this.visible = true;
            this._scale = new THREE.Object3D();
            this._scale.name = '_scale' + index;
            this._scale.add(mesh);
            this._rotationOffset = new THREE.Object3D();
            this._rotationOffset.add(this._scale);
            this._rotationOffset.name = '_rotationOffset' + index;
            this._rotation = new THREE.Object3D();
            this._rotation.add(this._rotationOffset);
            this._rotation.name = '_rotation' + index;
            this._position = new THREE.Object3D();
            this._position.add(this._rotation);
            this._position.name = '_position' + index;

            this.index = index;
            this.color = color;
            this.mesh = mesh;
            // this.material = mesh.material;
            this.setGeometry(mesh.geometry);
            this.normalScale = new THREE.Vector3(1, 1, 1).length();

            this.initPlugins();

        }

        setVisible(state) {
            if (state !== undefined) {
                this.visible = state;
            }
        }

        isVisible() {
            return this.visible;
        }

        setGeometry(geo) {

            if (this.geometry) {
                this.geometry.dispose();
            }

            this.geometry = geo;
            this.mesh.geometry = geo;
            this.verticesCopy = this.copyVertices();
        }

        getGeometry() {
            return this.geometry;
        }

        setMesh(mesh) {
            this.geometry = mesh.geometry;
            // this.material = mesh.material;
            this._scale.remove(this.mesh);
            this._scale.add(mesh);
            this.mesh = mesh;
        }

        getMesh() {
            return this.mesh;
        }

        setMaterial(material) {
            this.material = material;
            this.mesh.material = material;
        }

        getMaterial() {
            return this.mesh.material;
        }

        shapeVolume() {
            let i = this.index % audio.volumes.length;
            return audio.volumes[i];
        }

        sceneObject() {
            return this._position;
        }

        position(x, y, z) {
            this.x(x);
            this.y(y);
            this.z(z);
            return this.sceneObject().position;
        }

        getWorldPosition(target) {
            this.mesh.getWorldPosition(target);
        }

        x(v) {
            if (v !== undefined) {
                v = isNaN(v) ? 0 : v;
                this.sceneObject().position.x = v;
            }

            return this.sceneObject().position.x;
        }

        y(v) {
            if (v !== undefined) {
                v = isNaN(v) ? 0 : v;
                this.sceneObject().position.y = v * -1;
            }

            return this.sceneObject().position.y * -1;
        }

        z(v) {
            if (v !== undefined) {
                v = isNaN(v) ? 0 : v;
                this.sceneObject().position.z = v;
            }

            return this.sceneObject().position.z;
        }

        lookAt(vector) {
            this.sceneObject().lookAt(vector);
            this.getMesh().rotation.set(0, 0, 0);
        }

        forceLookAt(vector) {
            this.sceneObject().lookAt(vector);
            this.getMesh().lookAt(vector);
        }

        sceneRotation() {
            return this._rotation;
        }

        rotationX(x) {
            if (x !== undefined) {
                this.sceneRotation().rotation.x = x * RAD;
            }

            return this.sceneRotation().rotation.x;
        }

        rotationY(y) {
            if (y !== undefined) {
                this.sceneRotation().rotation.y = y * -RAD;
            }

            return this.sceneRotation().rotation.y;
        }

        rotationZ(z) {
            if (z !== undefined) {
                this.sceneRotation().rotation.z = z * -RAD;
            }

            return this.sceneRotation().rotation.z;
        }

        rotation(x, y, z) {
            this.rotationX(x);
            this.rotationY(y);
            this.rotationZ(z);

            return this.sceneRotation().rotation;
        }

        sceneRotationOffset() {
            return this._rotationOffset;
        }

        rotationOffset(x, y, z) {
            this.sceneRotationOffset().rotation.set(x * RAD, y * -RAD, z * -RAD);
        }

        sceneScale() {
            return this._scale;
        }

        scaleX(v) {
            if (v !== undefined) {

                if (v == 0) {
                    this.sceneScale().scale.x = 0.001;
                } else {
                    this.sceneScale().scale.x = v;
                }
            }

            return this.sceneScale().scale.x;
        }

        scaleY(v) {
            if (v !== undefined) {

                if (v == 0) {
                    this.sceneScale().scale.y = 0.001;
                } else {
                    this.sceneScale().scale.y = v;
                }
            }

            return this.sceneScale().scale.y;
        }

        scaleZ(v) {
            if (v !== undefined) {

                if (v == 0) {
                    this.sceneScale().scale.z = 0.001;
                } else {
                    this.sceneScale().scale.z = v;
                }
            }

            return this.sceneScale().scale.z;
        }

        scale(x, y, z) {
            this.scaleX(x);
            this.scaleY(y);
            this.scaleZ(z);

            return this.sceneScale().scale;
        }

        size() {
            return this.sceneScale().scale.length() / this.normalScale;
        }

        flip(x, y, z) {

            this.sceneScale().scale.x *= x;
            this.sceneScale().scale.y *= y;
            this.sceneScale().scale.z *= z;

            return this.sceneScale().scale;
        }

        offset(x, y, z) {
            if (x !== undefined) {
                this.mesh.position.set(
                    x || 0,
                    y || 0,
                    z || 0
                );
            }

            return this.mesh.position;
        }

        opacity(v) {
            if (v !== undefined) {
                if (v < 1) {
                    this.mesh.material.transparent = true;
                } else {
                    this.mesh.material.transparent = false;
                }
                this.mesh.material.opacity = v;
            }

            return this.mesh.material.opacity;
        }

        strokeWidth(v) {
            if (v !== undefined) {
                this.mesh.material.linewidth = Math.abs(v);
                this.mesh.material.wireframeLinewidth = Math.abs(2 * v);
                this.mesh.material.size = Math.abs(v * 40);
            }

            return this.mesh.material.wireframeLinewidth;
        }

        move(x, y, z) {
            this.x(this.x() + x);
            this.y(this.y() + y);
            this.z(this.z() + z);
        }

        updateMaterial(plugin, emissive) {

            let settings = this.parent.settings;
            let mat = this.mesh.material;
            let c = this.color;
            mat.color.setHSL(c.h / 360, c.s / 100, c.l / 100);

            if (mat.emissive) {
                if (emissive !== false) {
                    mat.emissive.setHSL(c.h / 360, c.s / 100, c.l / 100);
                } else {
                    mat.emissive.setHSL(0, 0, 0);
                }
            }

            if ('shininess' in mat && mat.shininess != settings.material_shininess) {
                mat.shininess = settings.material_shininess;

            } else if (mat.refractionRatio != settings.material_shininess) {
                mat.refractionRatio = settings.material_shininess / 100;
            }
            if (mat.roughness != settings.material_roughness) {
                mat.roughness = settings.material_roughness;
            }
            if (mat.metalness != settings.material_metalness) {
                mat.metalness = settings.material_metalness;
            }

            if (plugin.map) {
                if (mat.map != plugin.map) {
                    var keys = Object.getOwnPropertyNames(plugin);
                    for (let k in keys) {
                        let key = keys[k];
                        let val = plugin[key];
                        if (key in mat && val !== undefined) {
                            mat[key] = val;
                        }
                    }
                    mat.needsUpdate = true;

                } else {
                    if (mat.emissive) {
                        // for mapped material disable color by setting to lum 1
                        mat.emissive.setHSL(0, 0, emissive ? 1 : 0);
                    }
                }

                this._updateMaterialMap();


            } else if (mat.map) {
                mat.map = false;
                mat.emissiveMap = false;
                mat.needsUpdate = true;
            }

            this._updateMaterialBlending();

            if (mat.flatShading == settings.material_softshading) { // reversed logic!
                mat.flatShading = !settings.material_softshading; // reversed logic!
                mat.needsUpdate = true;
            }

            if (mat.side != settings.material_side) {
                mat.side = settings.material_side;
                mat.needsUpdate = true;
            }

            if (mat.shadowSide != settings.material_shadowside) {
                mat.shadowSide = settings.material_shadowside;
                mat.needsUpdate = true;
            }

            if (this.mesh.castShadow != settings.lighting_shadows) {
                this.mesh.castShadow = settings.lighting_shadows;
                this.mesh.receiveShadow = settings.lighting_shadows;
            }
        }

        /**
         *
         * @private
         */
        _updateMaterialBlending() {
            let settings = this.parent.settings;
            let mat = this.mesh.material;

            let b = settings.material_blending;
            if (b !== undefined) {
                b = THREE[b];

                if (mat.blending != b) {
                    mat.blending = b;
                    mat.needsUpdate = true;
                }
            }

            b = settings.material_blendequation;
            if (b !== undefined) {
                b = THREE[b];

                if (mat.blendEquation != b) {
                    mat.blendEquation = b;
                    mat.needsUpdate = true;
                }
            }

            b = settings.material_blendsrc;
            if (b !== undefined) {
                b = THREE[b];

                if (mat.blendSrc != b) {
                    mat.blendSrc = b;
                    mat.needsUpdate = true;
                }
            }

            b = settings.material_blenddst;
            if (b !== undefined) {
                b = THREE[b];

                if (mat.blendDst != b) {
                    mat.blendDst = b;
                    mat.needsUpdate = true;
                }
            }
        }

        /**
         *
         * @private
         */
        _updateMaterialMap() {
            let settings = this.parent.settings;
            let mat = this.mesh.material;
            if (mat.map) {
                let repeat = mat.map.repeat;
                let offset = mat.map.offset;
                let center = mat.map.center;

                if (repeat.x != settings.material_uvx) {
                    repeat.x = 1 / settings.material_uvx;
                }
                if (repeat.y != settings.material_uvy) {
                    repeat.y = 1 / settings.material_uvy;
                }
                if (settings.material_uvx <= 1) {
                    center.x = .5;
                    let uvofx;
                    if (offset.x != -(uvofx = settings.material_uvofx - .5)) {
                        offset.x = -uvofx;
                    }

                } else {
                    offset.x = 0;
                    if (center.x != settings.material_uvofx) {
                        center.x = 1 - settings.material_uvofx;
                    }
                }
                if (settings.material_uvy <= 1) {
                    center.y = .5;
                    let uvofy;
                    if (offset.y != (uvofy = settings.material_uvofy - .5)) {
                        offset.y = uvofy;
                    }
                } else {
                    offset.y = 0;
                    if (center.y != settings.material_uvofy) {
                        center.y = settings.material_uvofy;
                    }
                }
            }
        }

        getVertices() {
            return this.geometry.vertices;
        }

        copyVertices() {
            let geometry = this.geometry;
            let vertices = [];
            if (geometry.vertices) {
                for (let i = 0; i < geometry.vertices.length; i++) {
                    vertices.push(geometry.vertices[i].clone());
                }
            }

            return vertices;
        }

        //
        // dispose() {
        //     this.sceneObject().traverse(threeDispose);
        // }
    }
}