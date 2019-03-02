{
    HC.plugins.material_style.fillorstroke = class Plugin extends HC.MaterialStylePlugin {
        static name = 'chess (fill | stroke)';

        apply(shape) {
            let params = this.params(shape);
            params.stroke = (shape.index % 2 ? true : false);
        }
    }
}
{
    HC.plugins.material_style.strokeorfill = class Plugin extends HC.MaterialStylePlugin {
        static name = 'chess (stroke | fill)';

        apply(shape) {
            let params = this.params(shape);
            params.stroke = (shape.index % 2) ? false : true;
        }
    }
}