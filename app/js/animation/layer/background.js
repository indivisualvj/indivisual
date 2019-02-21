
/**
 *
 * @param value
 */
HC.Layer.prototype.setBackground = function (value) {

    this.resetBackground(false);

    if (value instanceof THREE.Mesh) {
        this.resetBackground(true);
        this.three.scene.background = null;

        this._background.add(value);
    }
    if (value instanceof THREE.Color || value instanceof THREE.Texture) {
        this.three.scene.background = value;

    } else {
        this.three.scene.background = null;
    }
};

/**
 *
 * @param recreate
 */
HC.Layer.prototype.resetBackground = function (recreate) {
    if (this._background) {
        this._layer.remove(this._background);
        this._background.traverse(threeDispose);
    }

    if (recreate !== false) {

        this._background = new THREE.Group();
        this._background.position.x = this.resolution('half').x;
        this._background.position.y = -this.resolution('half').y;
        this._background.name = '_background' + this.index;
        this._layer.add(this._background);
    }
};