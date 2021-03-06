{
    HC.plugins.shape_lookat.center = class Plugin extends HC.ShapeLookatPlugin {
        static index = 2;

        apply(shape) {
            let vector = this.centerVector();
            shape.lookAt(vector);
        }
    }
}
{
    HC.plugins.shape_lookat.forcecenter = class Plugin extends HC.ShapeLookatPlugin {
        static index = 2;

        apply(shape) {
            let vector = this.centerVector();
            shape.forceLookAt(vector);
        }
    }
}
{
    HC.plugins.shape_lookat.centerz = class Plugin extends HC.ShapeLookatPlugin {
        static name = 'center z-axis';
        static index = 3;

        apply(shape) {
            let x = shape.x();
            let y = shape.y();
            let vec = new THREE.Vector2(x, y);
            let cvec = this.centerVector().add(this.layer.resolution('half'));

            x = vec.x - cvec.x;
            y = vec.y - cvec.y;
            let angle = Math.atan2(y, x);
            shape.sceneObject().rotation.set(0, 0, -angle);
            shape.rotationZ(0);
        }
    }
}