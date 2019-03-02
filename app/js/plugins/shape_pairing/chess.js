{
    HC.plugins.shape_pairing.chess = class Plugin extends HC.ShapePairingPlugin {
        apply(shape) {
            var layer = this.layer;
            if (shape.index % 2 == 1) {
                var src = layer.shapes[shape.index - 1];
                shape.position().copy(src.position());
            }
        }
    }
}