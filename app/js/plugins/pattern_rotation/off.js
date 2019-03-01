HC.plugins.pattern_rotation.off = _class(
    function () {
        this.euler = new THREE.Euler();
        this.vector = new THREE.Vector3(0, 0, 0);
    }, HC.PatternRotationPlugin, {
        index: 1,
        apply() {

        }
    }
);