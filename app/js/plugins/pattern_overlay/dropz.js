{
    class Plugin extends HC.AnimationPlugin {
        static name = 'drop Z';
        apply (shape) {
            var params = this.params(shape);
            var duration = this.layer.getShapeDuration(shape);

            if (!params.velocity) {
                params.delay = duration / randomInt(1, 8);
                params.velocity = 1;

                this.layer.getPatternPlugin().apply(shape);
            }

            if (params.delay <= 0) {
                //accelerate
                if (this.settings.pattern_paddingz > 0) {
                    params.velocity = Math.max(1, params.velocity);

                } else if (this.settings.pattern_paddingz < 0) {
                    params.velocity = Math.min(-1, params.velocity);
                }
                var acc = Math.abs(this.settings.pattern_paddingz);

                params.velocity *= (1.05 * animation.diffPrc * acc);

                var so = shape.sceneObject();
                so.translateZ(params.velocity);

                var cam = this.layer.getCamera();
                if (so.position.z > cam.position.z) {
                    params.velocity = 0;
                }

            } else {
                //countdown
                params.delay -= animation.diff;
            }
        }
    }

    HC.plugins.pattern_overlay.dropz = Plugin;
}