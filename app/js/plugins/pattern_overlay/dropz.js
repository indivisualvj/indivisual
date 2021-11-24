{
    HC.plugins.pattern_overlay.dropz = class Plugin extends HC.AnimationPlugin {
        static name = 'drop Z';
        static tutorial = {
            activate: {
                text: 'Accelerates shapes on Z-Axis towards the Camera. To make it work perfectly, set pattern_overlay_volume to 1.0',
                action: function () {
                    this.animation.closeAll();
                    this.animation.animationSettingsGui.getChild('pattern').setOpen(true);
                    this.animation.updateSetting(this.config.ControlSettings.layer, {pattern:{pattern_overlay_volume: 1}}, true, true);
                }
            },
            invert: {
                text: 'To invert movement, twist the layer by 180°',
                action: function () {
                    this.animation.closeAll();
                    this.animation.animationSettingsGui.getChild('layer').setOpen(true);
                    this.animation.updateSetting(this.config.ControlSettings.layer, {layer:{layer_rotationy: 180}}, true, true);
                }
            }
        };

        apply (shape) {
            let params = this.params(shape);
            let duration = this.layer.getShapeDuration(shape);

            if (!params.velocity) {
                params.delay = duration / randomInt(.5, 1.5);
                params.velocity = 1;

                let pos = this.layer.getShape(shape.index).position();
                shape.position(pos.x, -pos.y, pos.z);
                // this.layer.doPlugin(this.layer.getPatternPlugin(), shape);
            }

            //accelerate
            if (params.delay <= 0) {

                // go backwards by rotating the layer
                let acc = Math.abs(this.settings.pattern_paddingz);
                params.velocity = Math.max(1, params.velocity);
                params.velocity *= (1.05 * this.animation.diffPrc * acc);

                let so = shape.sceneObject();
                so.translateZ(params.velocity);

                let dist = this.layer.cameraDefaultDistance(20)
                if (so.position.z > dist) {
                    params.velocity = 0;
                }

            //countdown
            } else {
                params.delay -= this.animation.diff;
            }
        }
    }
}
