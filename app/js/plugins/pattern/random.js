{
    HC.plugins.pattern.pivot = class Plugin extends HC.PatternPlugin {
        static name = 'random pivot (shape speed)';
        next = {x: 0, y: 0, z: 0};
        injections = {
            current: {x: 0, y: 0, z: 0}
        };

        apply(shape, rhythm) {
            let layer = this.layer;
            let speed = layer.getShapeSpeed(shape);
            if (speed.prc == 0) {
                let rot = shape.rotationZ();

                let pos = shape.position();
                let resX = this.layer.resolution('half').x;
                let resY = this.layer.resolution('half').y;
                let length = this.layer.resolution().length();
                let dist = randomInt(length/8, length, true);
                let x = Math.cos(rot);
                let y = Math.sin(rot);
                let dir = new THREE.Vector3(x, y, 0);
                dir.multiplyScalar(dist);
                pos.add(dir);


            }

        }
    }
}