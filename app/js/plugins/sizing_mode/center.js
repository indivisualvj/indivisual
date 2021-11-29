{
    HC.plugins.sizing_mode.center = class Plugin extends HC.SizingModePlugin {
        apply(shape, revert) {
            let layer = this.layer;
            let s = 1;
            let x = shape.x();
            let y = shape.y();
            let plug = this.layer.getPatternPlugin();
            let mx = plug.patternCenterX();
            let my = plug.patternCenterY();
            let dx = mx - x;
            let dy = my - y;
            let dt = Math.sqrt(mx * mx + my * my);
            let dr = Math.sqrt(dx * dx + dy * dy);

            if (revert !== true) {
                s = 0.2 + dr / dt;
            } else {
                s = 1 - dr / dt;
            }

            if (isNaN(s)) {
                s = 1;
            }

            s *= this.settings.sizing_scale;
            x = this.settings.sizing_x * s;
            y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}
{
    HC.plugins.sizing_mode.decenter = class Plugin extends HC.SizingModePlugin {
        apply(shape) {
            let layer = this.layer;
            layer.getSizingModePlugin('center').apply(shape, true);
        }
    }
}