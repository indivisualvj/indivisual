/**
 * @author indivisualvj / https://github.com/indivisualvj
 */


(function () {

    /**
     *
     * @param mesh
     * @param index
     * @param color
     * @constructor
     */
    HC.Shape = function (mesh, index, color) {

        // this.hc = this;
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
        this.material = mesh.material;
        this.setGeometry(mesh.geometry);
        this.normalScale = new THREE.Vector3(1, 1, 1).length();

        this.initPlugins();

    };

    HC.Shape.prototype = {

        setGeometry: function (geo) {

            if (this.geometry) {
                this.geometry.dispose();
            }

            this.geometry = geo;
            this.mesh.geometry = geo;
            this.verticesCopy = this.copyVertices();
        },

        getGeometry: function () {
            return this.geometry;
        },

        setMesh: function (mesh) {
            this.geometry = mesh.geometry;
            this.material = mesh.material;
            this._scale.remove(this.mesh);
            this._scale.add(mesh);
            this.mesh = mesh;
        },

        getMesh: function () {
            return this.mesh;
        },

        shapeVolume: function () {
            var i = this.index % audio.volumes.length;
            return audio.volumes[i];
        },

        sceneObject: function () {
            return this._position;
        },

        position: function (x, y, z) {
            this.x(x);
            this.y(y);
            this.z(z);
            return this.sceneObject().position;
        },

        getWorldPosition: function (target) {
            this.mesh.getWorldPosition(target);
        },

        x: function (v) {
            if (v !== undefined) {
                v = isNaN(v) ? 0 : v;
                this.sceneObject().position.x = v;
            }

            return this.sceneObject().position.x;
        },

        y: function (v) {
            if (v !== undefined) {
                v = isNaN(v) ? 0 : v;
                this.sceneObject().position.y = v * -1;
            }

            return this.sceneObject().position.y * -1;
        },

        z: function (v) {
            if (v !== undefined) {
                v = isNaN(v) ? 0 : v;
                this.sceneObject().position.z = v;
            }

            return this.sceneObject().position.z;
        },

        lookAt: function (vector) {
            this.sceneObject().lookAt(vector);
            this.getMesh().rotation.set(0, 0, 0);
        },

        forceLookAt: function (vector) {
            this.sceneObject().lookAt(vector);
            this.getMesh().lookAt(vector);
        },

        sceneRotation: function () {
            return this._rotation;
        },

        rotationX: function (x) {
            if (x !== undefined) {
                this.sceneRotation().rotation.x = x * RAD;
            }

            return this.sceneRotation().rotation.x;
        },

        rotationY: function (y) {
            if (y !== undefined) {
                this.sceneRotation().rotation.y = y * -RAD;
            }

            return this.sceneRotation().rotation.y;
        },

        rotationZ: function (z) {
            if (z !== undefined) {
                this.sceneRotation().rotation.z = z * -RAD;
            }

            return this.sceneRotation().rotation.z;
        },

        rotation: function (x, y, z) {
            this.rotationX(x);
            this.rotationY(y);
            this.rotationZ(z);

            return this.sceneRotation().rotation;
        },

        sceneRotationOffset: function () {
            return this._rotationOffset;
        },

        rotationOffset: function (x, y, z) {
            this.sceneRotationOffset().rotation.set(x * RAD, y * -RAD, z * -RAD);
        },

        sceneScale: function () {
            return this._scale;
        },

        scaleX: function (v) {
            if (v !== undefined) {

                if (v == 0) {
                    this.sceneScale().scale.x = 0.001;
                } else {
                    this.sceneScale().scale.x = v;
                }
            }

            return this.sceneScale().scale.x;
        },

        scaleY: function (v) {
            if (v !== undefined) {

                if (v == 0) {
                    this.sceneScale().scale.y = 0.001;
                } else {
                    this.sceneScale().scale.y = v;
                }
            }

            return this.sceneScale().scale.y;
        },

        scaleZ: function (v) {
            if (v !== undefined) {

                if (v == 0) {
                    this.sceneScale().scale.z = 0.001;
                } else {
                    this.sceneScale().scale.z = v;
                }
            }

            return this.sceneScale().scale.z;
        },

        scale: function (x, y, z) {
            this.scaleX(x);
            this.scaleY(y);
            this.scaleZ(z);

            return this.sceneScale().scale;
        },

        size: function () {
            return this.sceneScale().scale.length() / this.normalScale;
        },

        flip: function (x, y, z) {

            this.sceneScale().scale.x *= x;
            this.sceneScale().scale.y *= y;
            this.sceneScale().scale.z *= z;

            return this.sceneScale().scale;
        },

        offset: function (x, y, z) {
            if (x !== undefined) {
                this.mesh.position.set(
                    x || 0,
                    y || 0,
                    z || 0
                );
            }

            return this.mesh.position;
        },

        opacity: function (v) {
            if (v !== undefined) {
                if (v < 1) {
                    this.mesh.material.transparent = true;
                } else {
                    this.mesh.material.transparent = false;
                }
                this.mesh.material.opacity = v;
            }

            return this.mesh.material.opacity;
        },

        strokeWidth: function (v) {
            if (v !== undefined) {
                this.mesh.material.linewidth = Math.abs(v);
                this.mesh.material.wireframeLinewidth = Math.abs(2 * v);
                this.mesh.material.size = Math.abs(v * 40);
            }

            return this.mesh.material.wireframeLinewidth;
        },

        move: function (x, y, z) {
            this.x(this.x() + x);
            this.y(this.y() + y);
            this.z(this.z() + z);
        },

        updateMaterial: function (map, emissive) {

            var settings = this._layer.settings;
            var mat = this.mesh.material;
            var c = this.color;
            mat.color.setHSL(c.h / 360, c.s / 100, c.l / 100);

            if (mat.emissive) {
                if (emissive !== false) {
                    mat.emissive.setHSL(c.h / 360, c.s / 100, c.l / 100);
                } else {
                    mat.emissive.setHSL(0, 0, 0);
                }
            }

            if (mat.shininess != settings.material_shininess) {
                mat.shininess = settings.material_shininess;
            }
            if (mat.roughness != settings.material_roughness) {
                mat.roughness = settings.material_roughness;
            }
            if (mat.metalness != settings.material_metalness) {
                mat.metalness = settings.material_metalness;
            }

            if (map) {
                if (mat.map != map) {
                    mat.map = map;
                    mat.emissiveMap = map;
                    mat.needsUpdate = true;

                } else {
                    if (mat.emissive) {
                        // for mapped material disable color by setting to lum 1
                        mat.emissive.setHSL(0, 0, emissive ? 1 : 0);
                    }
                }

                var repeat = mat.map.repeat;
                var center = mat.map.center;

                // todo .transformUv evtl beim zoom1 und verschieben.

                if (repeat.x != settings.material_uvx) {
                    repeat.x = 1 / settings.material_uvx;
                }
                if (repeat.y != settings.material_uvy) {
                    repeat.y = 1 / settings.material_uvy;
                }
                if (center.x != settings.material_uvofx) {
                    center.x = settings.material_uvofx;
                }
                if (center.y != settings.material_uvofy) {
                    center.y = settings.material_uvofy;
                }

            } else if (mat.map) {
                mat.map = false;
                mat.emissiveMap = false;
                mat.needsUpdate = true;
            }


            var b = settings.material_blending;
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

            if (mat.flatShading == settings.material_softshading) {
                mat.flatShading = !settings.material_softshading;
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
        },

        getVertices: function () {
            return this.geometry.vertices;
        },

        copyVertices: function () {
            var geometry = this.geometry;
            var vertices = [];
            if (geometry.vertices) {
                for (var i = 0; i < geometry.vertices.length; i++) {
                    vertices.push(geometry.vertices[i].clone());
                }
            }

            return vertices;
        },
        //
        // dispose: function () {
        //     this.sceneObject().traverse(threeDispose);
        // }
    }
})();