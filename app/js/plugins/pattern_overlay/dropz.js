{
    class Plugin extends HC.AnimationPlugin {
        static name = 'drop Z';
        static tutorial = {
            activate: {
                text: 'Accelerates shapes on Z-Axis towards the Camera. To make it work perfectly, set pattern_overlay_volume to 1.0',
                action: function () {
                    controller.closeAll();
                    controller.toggleByProperty('pattern_overlay_volume');
                    controller.updateSetting(statics.ControlSettings.layer, 'pattern_overlay_volume', 1, true, true);
                }
            },
            invert: {
                text: 'To invert movement, twist the layer by 180°',
                action: function () {
                    controller.closeAll();
                    controller.toggleByProperty('layer_rotationy');
                    controller.updateSetting(statics.ControlSettings.layer, 'layer_rotationy', 180, true, true);
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

    HC.plugins.pattern_overlay.dropz = Plugin; // todo why is this still there?
}