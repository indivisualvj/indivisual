// wobble: https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-dynamic-geometry
// for (var i = 0; i < sphere.geometry.vertices.length; i++) {
//     var p = sphere.geometry.vertices[i];
//     p.normalize().multiplyScalar(1 + 0.3 * noise.perlin3(p.x, p.y, p.z));
// }
HC.plugins.shape_transform.wobble = _class(false, HC.ShapeTransformPlugin, {
    name: 'wobble xyz',
    injections: {
        angle: false,
        rumble: {
            x: 0,
            y: 0,
            z: 0
        }
    },

    apply: function (shape, axes) {

        if (!shape.getVertices()) {
            shape.setGeometry(shape.geometry.userData.geometry);
        }

        if (this.isFirstShape(shape)) {
            var params = this.params(shape);

            axes = axes || new THREE.Vector3(1, 1, 1);

            if (!params.angle) {
                params.angle = 360;

                params.osci = {
                    osci1_period: .125,
                    osci1_amp: 4,
                    osci2_period: .066783782,
                    osci2_amp: 1,
                    osci3_period: .022342,
                    osci3_amp: 2,
                    rhythm: 'half'
                };
            }

            params.osci.rhythm = this.settings.rhythm;

            var multiplier = this.settings.shape_transform_volume * 15;
            var vertices = shape.getVertices();
            var vbackup = shape.verticesCopy;

            if (vertices) {

                for (var i = 0; i < vertices.length; i++) {

                    var vtc = vertices[i];
                    var vtcb = vbackup[i];
                    if (!vtcb._rumble) {
                        vtcb._rumble = {
                            x: randomFloat(0, Math.PI, 2, true),
                            y: randomFloat(0, Math.PI, 2, true),
                            z: randomFloat(0, Math.PI, 2, true)
                        };
                    }

                    vtcb._rumble.x += animation.diffPrc * randomFloat(0, .25*Math.PI, 2, true);
                    vtcb._rumble.y += animation.diffPrc * randomFloat(0, .25*Math.PI, 2, true);
                    vtcb._rumble.z += animation.diffPrc * randomFloat(0, .25*Math.PI, 2, true);

                    var w1 = multiplier * HC.Osci.wobble(vtcb._rumble.x, params.osci);
                    var w2 = multiplier * HC.Osci.wobble(vtcb._rumble.y, params.osci);
                    var w3 = multiplier * HC.Osci.wobble(vtcb._rumble.z, params.osci);

                    vtc.x = vtcb.x + w1 * axes.x;
                    vtc.y = vtcb.y + w2 * axes.y;
                    vtc.z = vtcb.z + w3 * axes.z;

                }

                shape.geometry.verticesNeedUpdate = true;

            } else if (!vertices) {
                console.warn('No transform for ' + shape.geometry.type);
            }
        }
    }
});

HC.plugins.shape_transform.wobblex = _class(false, HC.plugins.shape_transform.wobble, {
    name: 'wobble x',

    apply: function (shape) {
        HC.plugins.shape_transform.wobble.prototype.apply.call(this, shape, new THREE.Vector3(1, 0, 0));
    }
});

HC.plugins.shape_transform.wobbley = _class(false, HC.plugins.shape_transform.wobble, {
    name: 'wobble y',

    apply: function (shape) {
        HC.plugins.shape_transform.wobble.prototype.apply.call(this, shape, new THREE.Vector3(0, 1, 0));
    }
});

HC.plugins.shape_transform.wobblez = _class(false, HC.plugins.shape_transform.wobble, {
    name: 'wobble z',

    apply: function (shape) {
        HC.plugins.shape_transform.wobble.prototype.apply.call(this, shape, new THREE.Vector3(0, 0, 1));
    }
});