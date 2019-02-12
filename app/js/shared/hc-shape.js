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

        shapeVolume: function () {
            var i = this.index % audio.volumes.length;
            var v = audio.volumes[i];
            return v === undefined ? 1 : v;
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

            var c = this.color;
            this.mesh.material.color.setHSL(c.h / 360, c.s / 100, c.l / 100);
            if (this.mesh.material.emissive) {
                if (emissive !== false) {
                    this.mesh.material.emissive.setHSL(c.h / 360, c.s / 100, c.l / 100);
                } else {
                    this.mesh.material.emissive.setHSL(0, 0, 0);
                }
            }

            if (this.mesh.material.shininess != this._layer.settings.material_shininess) {
                this.mesh.material.shininess = this._layer.settings.material_shininess;
            }
            if (this.mesh.material.roughness != this._layer.settings.material_roughness) {
                this.mesh.material.roughness = this._layer.settings.material_roughness;
            }
            if (this.mesh.material.metalness != this._layer.settings.material_metalness) {
                this.mesh.material.metalness = this._layer.settings.material_metalness;
            }

            if (map) {
                if (this.mesh.material.map != map) {
                    this.mesh.material.map = map;
                    this.mesh.material.emissiveMap = map;
                    this.mesh.material.needsUpdate = true;

                } else {
                    if (this.mesh.material.emissive) {
                        // for mapped material disable color by setting to lum 1
                        this.mesh.material.emissive.setHSL(0, 0, emissive ? 1 : 0);
                    }
                }

            } else if (this.mesh.material.map) {
                this.mesh.material.map = false;
                this.mesh.material.emissiveMap = false;
                this.mesh.material.needsUpdate = true;
            }

            var b = this._layer.settings.material_blending;
            if (b !== undefined) {
                b = THREE[b];

                if (this.mesh.material.blending != b) {
                    this.mesh.material.blending = b;
                    this.mesh.material.needsUpdate = true;
                }
            }

            b = this._layer.settings.material_blendequation;
            if (b !== undefined) {
                b = THREE[b];

                if (this.mesh.material.blendEquation != b) {
                    this.mesh.material.blendEquation = b;
                    this.mesh.material.needsUpdate = true;
                }
            }

            b = this._layer.settings.material_blendsrc;
            if (b !== undefined) {
                b = THREE[b];

                if (this.mesh.material.blendSrc != b) {
                    this.mesh.material.blendSrc = b;
                    this.mesh.material.needsUpdate = true;
                }
            }

            b = this._layer.settings.material_blenddst;
            if (b !== undefined) {
                b = THREE[b];

                if (this.mesh.material.blendDst != b) {
                    this.mesh.material.blendDst = b;
                    this.mesh.material.needsUpdate = true;
                }
            }

            if (this.mesh.material.flatShading == this._layer.settings.material_softshading) {
                this.mesh.material.flatShading = !this._layer.settings.material_softshading;
                this.mesh.material.needsUpdate = true;
            }

            if (this.mesh.material.side != this._layer.settings.material_side) {
                this.mesh.material.side = this._layer.settings.material_side;
                this.mesh.material.needsUpdate = true;
            }

            if (this.mesh.castShadow != this._layer.settings.lighting_shadows) {
                this.mesh.castShadow = this._layer.settings.lighting_shadows;
                this.mesh.receiveShadow = this._layer.settings.lighting_shadows;
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