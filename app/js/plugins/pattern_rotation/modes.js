HC.plugins.pattern_rotation.all = _class(
    function () {
        this.euler = new THREE.Euler();
        this.vector = new THREE.Vector3(1, 1, 1);
    }, HC.PatternRotationPlugin, {
        apply: function () {
        }
    }
);

HC.plugins.pattern_rotation.xaxis = _class(
    function () {
        this.euler = new THREE.Euler();
        this.vector = new THREE.Vector3(1, 0, 0);
    }, HC.PatternRotationPlugin, {
        apply: function () {
        }
    }
);

HC.plugins.pattern_rotation.yaxis = _class(
    function () {
        this.euler = new THREE.Euler();
        this.vector = new THREE.Vector3(0, 1, 0);
    }, HC.PatternRotationPlugin, {
        apply: function () {
        }
    }
);

HC.plugins.pattern_rotation.zaxis = _class(
    function () {
        this.euler = new THREE.Euler();
        this.vector = new THREE.Vector3(0, 0, 1);
    }, HC.PatternRotationPlugin, {
        apply: function () {
        }
    }
);