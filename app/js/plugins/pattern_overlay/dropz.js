{
    HC.plugins.pattern_overlay.dropz = class Plugin extends HC.AnimationPlugin {
        static name = 'drop Z';
        static tutorial = {
            activate: {
                text: 'Accelerates shapes on Z-Axis towards the Camera. To make it work perfectly, set pattern_overlay_volume to 1.0',
                action: function () {
                    messaging.program.closeAll();
                    messaging.program.animationSettingsGui.getChild('pattern').setOpen(true);
                    messaging.program.updateSetting(statics.ControlSettings.layer, {pattern:{pattern_overlay_volume: 1}}, true, true);
                }
            },
            invert: {
                text: 'To invert movement, twist the layer by 180°',
                action: function () {
                    messaging.program.closeAll();
                    messaging.program.animationSettingsGui.getChild('layer').setOpen(true);
                    messaging.program.updateSetting(statics.ControlSettings.layer, {layer:{layer_rotationy: 180}}, true, true);
                }
            }
        };

        apply (shape) {
            let params = this.params(shape);
            let duration = this.layer.getShapeDuration(shape);

            if (!params.velocity) {
                params.delay = duration / randomInt(1, 8);
                params.velocity = 1;

                this.layer.doPlugin(this.layer.getPatternPlugin(), shape);
                // this.layer.getPatternPlugin().apply(shape);
            }

            //accelerate
            if (params.delay <= 0) {

                // go backwards by rotating the layer
                let acc = Math.abs(this.settings.pattern_paddingz);
                params.velocity = Math.max(1, params.velocity);
                params.velocity *= (1.05 * animation.diffPrc * acc);

                let so = shape.sceneObject();
                so.translateZ(params.velocity);

                let cam = this.layer.getCamera();
                if (so.position.z > cam.position.z * 1.1) {
                    params.velocity = 0;
                }

            //countdown
            } else {
                params.delay -= animation.diff;
            }
        }
    }
}
