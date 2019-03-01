HC.plugins.material_style.random = _class(false, HC.MaterialStylePlugin, {
    name: 'random',
    injections: {
        state: undefined
    },
    apply(shape) {
        var pa = this.params(shape);
        if (pa.state === undefined) {
            pa.state = randomBool();
        }

        var params = this.params(shape);
        params.stroke = pa.state;
    }
});

HC.plugins.material_style.randompeak = _class(false, HC.MaterialStylePlugin, {
    name: 'random on peak (wireframe)',
    injections: {
        state: undefined
    },
    apply(shape) {
        var pa = this.params(shape);
        if (pa.state === undefined || (audio.peak && randomBool())) {
            pa.state = randomBool();
        }

        var params = this.params(shape);
        params.stroke = pa.state;
    }
});
