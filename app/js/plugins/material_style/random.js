{
    HC.plugins.material_style.random = class Plugin extends HC.MaterialStylePlugin {
        static name = 'random';
        injections = {
            state: undefined
        };

        apply(shape) {
            let pa = this.params(shape);
            if (pa.state === undefined) {
                pa.state = randomBool();
            }

            let params = this.params(shape);
            params.stroke = pa.state;
        }
    }
}
{
    HC.plugins.material_style.randompeak = class Plugin extends HC.MaterialStylePlugin {
        static name = 'random on peak';
        injections = {
            state: undefined
        };

        apply(shape) {
            let pa = this.params(shape);
            if (pa.state === undefined || (audio.peak && randomBool())) {
                pa.state = randomBool();
            }

            let params = this.params(shape);
            params.stroke = pa.state;
        }
    }
}
