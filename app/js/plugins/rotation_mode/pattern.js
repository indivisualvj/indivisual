{
    HC.plugins.rotation_mode.one = class Plugin extends HC.plugins.rotation_mode.default {
        /**
         * @see HC.RotationModePlugin.injections
         */

        /**
         *
         * @param HC.Shape shape
         */
        apply(shape) {
            if (this.isFirstShape(shape)) {
                this.index = randomInt(0, this.layer.shapeCount());
            }
            if (shape.index === this.index) {
                super.apply(shape);
            }
        }
    }
}

{
    HC.plugins.rotation_mode.chess = class Plugin extends HC.plugins.rotation_mode.default {
        /**
         * @see HC.RotationModePlugin.injections
         */

        /**
         *
         * @param HC.Shape shape
         */
        apply(shape) {
            if (this.isFirstShape(shape)) {
                this.switcher = !this.switcher;
            }

            let mod = this.switcher ? 0 : 1;

            if (shape.index % 2 === mod) {
                super.apply(shape);

            }
        }
    }
}