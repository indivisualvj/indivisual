HC.plugins.pattern_rotation = HC.plugins.pattern_rotation || {};
{
    HC.PatternRotationPlugin = class Plugin extends HC.AnimationPlugin {
        before() {
            var roto = this.layer.shape.rotation();
            var rove = roto.toVector3();
            rove.multiply(this.vector);
            rove.multiplyScalar(this.settings.pattern_rotation_multiplier);
            this.euler.setFromVector3(rove);
        }

        positionIn3dSpace(shape, cp) {
            cp.applyEuler(this.euler);
            cp.add(this.layer.patternCenterVector(true));
            shape.position().copy(cp);
        }
    }
}