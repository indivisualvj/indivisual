HC.plugins.lighting_lookat.center = _class(false, HC.LightingLookatPlugin, {

    before: function (light) {
        return light.target ? true : false;
    },

    apply: function (light) {

        if (!this.target || this.isFirstShape(light)) {
            this.target = new THREE.Object3D();
            this.layer._lighting.add(this.target);

        }

        if (light.target != this.target) {
            light.target = this.target;
        }

        this.target.position.copy(this.centerVector());
    }
});

HC.plugins.lighting_lookat.straight = _class(false, HC.LightingLookatPlugin, {

    before: function (light) {
        var i = light.userData.index;
        if (!this.targets || !(i in this.targets)) {
            this.targets = [];
            var target = new THREE.Object3D();
            this.targets[i] = target;
            this.layer._lighting.add(target);
        }

        if (light.target != this.targets[i]) {
            light.target = this.targets[i];
        }
    },

    apply: function (light) {

        light.target.position.copy(light.position);
        var cv = this.centerVector();
        cv.multiplyScalar(8);
        light.target.position.add(cv);
        light.target.position.z = this.centerVector().z;
    }
});