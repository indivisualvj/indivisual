HC.plugins.material_style.fillorstroke = _class(false, HC.MaterialStylePlugin, {
    name: 'chess (fill | stroke)',
    apply: function (shape) {
        var layer = this.layer;
        var params = this.params(shape);
        params.stroke = (shape.index % 2 ? true : false);
    }
});

HC.plugins.material_style.strokeorfill = _class(false, HC.MaterialStylePlugin, {
    name: 'chess (stroke | fill)',
    apply: function (shape) {
        var layer = this.layer;
        var params = this.params(shape);
        params.stroke = (shape.index % 2);
    }
});
