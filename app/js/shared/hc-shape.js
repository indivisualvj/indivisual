/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    HC.Shape = class Shape {

        parent;
        visible = true;
        _scale;
        _rotationOffset;
        _rotation;
        _position;
        index;
        color;
        mesh;
        geometry;
        normalScale;
        materialNeedsUpdate = true;

        /**
         *
         * @param mesh
         * @param index
         * @param color
         */
        constructor(mesh, index, color) {
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
            this.geometry = mesh.geometry;
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

        getGeometry() {
            return this.geometry;
        }

        setMesh(mesh) {
            this.geometry = mesh.geometry;
            this._scale.remove(this.mesh);
            this._scale.add(mesh);
            this.mesh = mesh;
        }

        getMesh() {
            return this.mesh;
        }

        setMaterial(material) {
            this.mesh.material = material;
        }

        getMaterial() {
            return this.mesh.material;
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

                if (v === 0) {
                    this.sceneScale().scale.x = 0.001;
                } else {
                    this.sceneScale().scale.x = v;
                }
            }

            return this.sceneScale().scale.x;
        }

        scaleY(v) {
            if (v !== undefined) {

                if (v === 0) {
                    this.sceneScale().scale.y = 0.001;
                } else {
                    this.sceneScale().scale.y = v;
                }
            }

            return this.sceneScale().scale.y;
        }

        scaleZ(v) {
            if (v !== undefined) {

                if (v === 0) {
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

        /**
         *
         * @param plugin
         * @param emissive
         */
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
            if (mat.specularColor) {
                console.log(mat.specularColor);
            }

            if (plugin.properties && plugin.properties.map) {
                if (mat.map !== plugin.properties.map) {
                    let keys = Object.keys(plugin.properties);
                    for (let k in keys) {
                        let key = keys[k];
                        let val = plugin.properties[key];
                        if (key in mat && val !== undefined) {
                            mat[key] = val;
                        }
                    }
                    mat.needsUpdate = true;

                } else {
                    if (mat.emissive) {
                        // for mapped material disable color by setting to lum 1 _check hugh?
                        mat.emissive.setHSL(0, 0, emissive ? 1 : 0);
                    }
                }

            } else if (mat.map) {
                let keys = Object.keys(plugin.properties);
                for (let k in keys) {
                    let key = keys[k];
                    if (key in mat) {
                        mat[key] = null;
                    }
                }
                mat.needsUpdate = true;
            }

            this.mesh.castShadow = settings.lighting_shadows;
            this.mesh.receiveShadow = settings.lighting_shadows;

            if (this.materialNeedsUpdate) {
                mat.shininess = settings.material_shininess * 100;
                mat.refractionRatio = settings.material_volume;
                mat.reflectivity = settings.material_reflectivity;
                mat.roughness = settings.material_roughness;
                mat.metalness = settings.material_metalness;
                mat.displacementScale = settings.material_disp_scale;
                mat.displacementBias = settings.material_disp_bias;

                this._updateMaterialBlending();

                if (mat.flatShading === settings.material_softshading) { // reversed logic!
                    mat.flatShading = !settings.material_softshading; // reversed logic!
                }

                if (mat.side !== settings.material_side) {
                    mat.side = settings.material_side;
                }

                if (mat.shadowSide !== settings.material_shadowside) {
                    mat.shadowSide = settings.material_shadowside;
                }

                this.materialNeedsUpdate = false;
                mat.needsUpdate = true;
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

                if (mat.blending !== b) {
                    mat.blending = b;
                }
            }

            b = settings.material_blendequation;
            if (b !== undefined) {
                b = THREE[b];

                if (mat.blendEquation !== b) {
                    mat.blendEquation = b;
                }
            }

            b = settings.material_blendsrc;
            if (b !== undefined) {
                b = THREE[b];

                if (mat.blendSrc !== b) {
                    mat.blendSrc = b;
                }
            }

            b = settings.material_blenddst;
            if (b !== undefined) {
                b = THREE[b];

                if (mat.blendDst !== b) {
                    mat.blendDst = b;
                }
            }
        }
    }
}
