{
HC.plugins.pattern.move = class Plugin extends HC.PatternPlugin {
    static name = 'move';
    injections = {
        velocity: false,
        euler: false
    },

    apply(shape) {
        var layer = this.layer;


        var params = this.params(shape);

        var x = shape.x();
        var y = shape.y();
        var z = shape.z();

        if (!params.velocity) {

            x = randomInt(0, layer.resolution().x);
            y = randomInt(0, layer.resolution().y);
            z = 0;
            shape.position(x, y, z);

            params.velocity = randomInt(2, 5, false);

        }

        var roto = shape.rotation();
        var dir = new THREE.Vector3(0, 0, 1);
        dir.applyEuler(roto);

        var m = params.velocity * animation.diffPrc * this.settings.pattern_padding;
        dir.multiplyScalar(m);

        shape.position().add(dir);

        if (x > layer.resolution().x + layer.shapeSize(.5)) {
            shape.x(-layer.shapeSize(.5));

        } else if (x < -layer.shapeSize(.5)) {
            shape.x(layer.resolution().x + layer.shapeSize(.5));
        }

        if (y > layer.resolution().y + layer.shapeSize(.5)) {
            shape.y(-layer.shapeSize(.5));

        } else if (y < -layer.shapeSize(.5)) {
            shape.y(layer.resolution().y + layer.shapeSize(.5));
        }

        if (z > layer.cameraDefaultDistance() || z < -layer.cameraDefaultDistance()) {
            shape.z(0);
        }
    }
});