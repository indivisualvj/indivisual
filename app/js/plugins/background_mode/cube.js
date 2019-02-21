HC.plugins.background_mode.cube = _class(false, HC.BackgroundModePlugin, {
    apply: function () {
        if (this.current() !== this._settingID()) {
            this.current(this._settingID());

            var color = new THREE.Color(this.settings.background_color);
            var res = this.layer.resolution().clone();
            res.multiplyScalar(this.settings.background_volume * 2.5);
            var cube = new THREE.BoxBufferGeometry(res.x, res.y, res.x);
            var mat = new THREE.MeshStandardMaterial({color: color, side: THREE.DoubleSide});
            var mesh = new THREE.Mesh(cube, mat);
            mesh.receiveShadow = true;

            this.layer.setBackground(mesh);

        }
    }
});