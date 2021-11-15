/**
 *
 * @param value
 */
HC.Layer.prototype.setBackground = function (value) {

    this._resetBackground(false);

    if (value instanceof THREE.Object3D) {
        this._resetBackground(true);
        this._background.add(value);
    }
    if (value instanceof THREE.Color || value instanceof THREE.Texture) {
        this._layer.background = value;
    }
};

/**
 *
 * @param recreate
 * @private
 */
HC.Layer.prototype._resetBackground = function (recreate) {
    if (this._background) {
        this._layer.remove(this._background);
        this._background.traverse(threeDispose);
    }

    this._layer.background = null;

    if (recreate !== false) {
        this._background = new THREE.Group();
        this._background.position.x = this.resolution('half').x;
        this._background.position.y = -this.resolution('half').y;
        this._background.name = '_background' + this.index;
        this._layer.add(this._background);
    }
};