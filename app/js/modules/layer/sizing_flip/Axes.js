import {SizingFlipPlugin} from "../SizingFlipPlugin";

class flipx2 extends SizingFlipPlugin {
    apply(shape) {
        if (shape.index % 2 === 0) {
            shape.flip(-1, 1, 1);
        }
    }
}


class flipy2 extends SizingFlipPlugin {
    apply(shape) {
        if (shape.index % 2 === 0) {
            shape.flip(1, -1, 1);
        }
    }
}


class flipxy2 extends SizingFlipPlugin {
    apply(shape) {
        if (shape.index % 2 === 0) {
            shape.flip(-1, -1, 1);
        }
    }
}


class flipxy3 extends SizingFlipPlugin {
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

export {flipx2, flipxy2, flipxy3, flipy2};
