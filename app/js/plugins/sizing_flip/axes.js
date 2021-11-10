{
    HC.plugins.sizing_flip.flipx2 = class Plugin extends HC.SizingFlipPlugin {
        apply(shape) {
            if (shape.index % 2 === 0) {
                shape.flip(-1, 1, 1);
            }
        }
    }
}
{
    HC.plugins.sizing_flip.flipy2 = class Plugin extends HC.SizingFlipPlugin {
        apply(shape) {
            if (shape.index % 2 === 0) {
                shape.flip(1, -1, 1);
            }
        }
    }
}
{
    HC.plugins.sizing_flip.flipxy2 = class Plugin extends HC.SizingFlipPlugin {
        apply(shape) {
            if (shape.index % 2 === 0) {
                shape.flip(-1, -1, 1);
            }
        }
    }
}
{
    HC.plugins.sizing_flip.flipxy3 = class Plugin extends HC.SizingFlipPlugin {
        apply(shape) {
            if (shape.index % 3 === 0) {
                shape.flip(-1, 1, 1);

            } else if (shape.index % 3 === 1) {
                shape.flip(1, -1, 1);

            } else if (shape.index % 3 === 2) {
                shape.flip(-1, -1, 1);
            }
        }
    }
}