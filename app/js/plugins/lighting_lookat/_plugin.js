HC.plugins.lighting_lookat = HC.plugins.lighting_lookat || {};

HC.LightingLookatPlugin = _class(false, HC.Plugin, {

    isFirstShape: function (light) {
        return light.userData.index == 0;
    },

    centerVector: function () {
        return new THREE.Vector3(
            this.layer.diameterVector.length() / 4 * this.settings.lighting_lookat_centerx,
            this.layer.diameterVector.length() * this.settings.lighting_lookat_centery,
            this.layer.cameraDefaultDistance(1) * this.settings.lighting_lookat_centerz
        );
    }
});