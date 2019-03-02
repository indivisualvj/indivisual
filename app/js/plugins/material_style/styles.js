{
    HC.plugins.material_style.fill = class Plugin extends HC.MaterialStylePlugin {
        static index = 1;
        static name = 'fill';

        apply(shape) {
            let params = this.params(shape);
            params.stroke = false;
        }
    }
}
{
    HC.plugins.material_style.stroke = class Plugin extends HC.MaterialStylePlugin {
        static name = 'stroke';

        apply(shape) {
            let params = this.params(shape);
            params.stroke = true;
        }
    }
}
{
    HC.plugins.material_style.peak = class Plugin extends HC.MaterialStylePlugin {
        static name = 'switch on peak';
        state = false;

        apply(shape) {
            if (this.isFirstShape(shape)) {
                if (audio.peak && randomBool()) {
                    this.state = !this.state;
                }
            }

            let params = this.params(shape);
            params.stroke = this.state;
        }
    }
}