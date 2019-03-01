HC.plugins.shape_lookat.center = _class(false, HC.ShapeLookatPlugin, {
    index: 2,
    apply(shape) {
        var vector = this.layer.lookAtVector();
        shape.lookAt(vector);
    }
});

HC.plugins.shape_lookat.forcecenter = _class(false, HC.ShapeLookatPlugin, {
    index: 2,
    apply(shape) {
        var vector = this.layer.lookAtVector();
        shape.forceLookAt(vector);
    }
});

HC.plugins.shape_lookat.centerz = _class(false, HC.ShapeLookatPlugin, {
    name: 'center z-axis',
    index: 3,
    apply(shape) {
        var x = shape.x();
        var y = shape.y();
        var vec = new THREE.Vector2(x, y);
        var cvec = this.layer.lookAtVector().add(this.layer.resolution('half'));

        var x = vec.x - cvec.x;
        var y = vec.y - cvec.y;
        var angle = Math.atan2(y, x);
        shape.sceneObject().rotation.set(0, 0, -angle);
        shape.rotationZ(0);
    }
});