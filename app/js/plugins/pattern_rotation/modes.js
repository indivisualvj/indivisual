{
    HC.plugins.pattern_rotation.all = class Plugin extends HC.PatternRotationPlugin {
        vector = new THREE.Vector3(1, 1, 1);

        apply() {
        }
    }
}
{
    HC.plugins.pattern_rotation.xaxis = class Plugin extends HC.PatternRotationPlugin {
        vector = new THREE.Vector3(1, 0, 0);

        apply() {
        }
    }
}
{
    HC.plugins.pattern_rotation.yaxis = class Plugin extends HC.PatternRotationPlugin {
        vector = new THREE.Vector3(0, 1, 0);

        apply() {
        }
    }
}
{
    HC.plugins.pattern_rotation.zaxis = class Plugin extends HC.PatternRotationPlugin {
        vector = new THREE.Vector3(0, 0, 1);

        apply() {
        }
    }
}