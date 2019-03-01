HC.plugins.material_style.fill = _class(false, HC.MaterialStylePlugin, {
    index: 1,
    name: 'fill',
    apply(shape) {
        var params = this.params(shape);
        params.stroke = false;
    }
});

HC.plugins.material_style.stroke = _class(false, HC.MaterialStylePlugin, {
    name: 'stroke',
    apply(shape) {
        var params = this.params(shape);
        params.stroke = true;
    }
});

HC.plugins.material_style.peak = _class(
    function () {
        this.state = false;
    }, HC.MaterialStylePlugin, {
        name: 'switch on peak',
        apply(shape) {
            if (this.isFirstShape(shape)) {
                if (audio.peak && randomBool()) {
                    this.state = !this.state;
                }
            }

            var params = this.params(shape);
            params.stroke = this.state;
        }
    }
);
