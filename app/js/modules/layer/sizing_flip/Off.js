import {SizingFlipPlugin} from "../SizingFlipPlugin";

class off extends SizingFlipPlugin {
    static index = 1; // hast to be first @see Layer.plugins.sizing_flip.random
    static name = 'off';

    apply(shape) {
        shape.flip(1, 1, 1);
    }
}

export {off};
