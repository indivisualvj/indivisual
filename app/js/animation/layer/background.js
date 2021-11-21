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

HC.Layer.prototype.setBackgroundVisible = function (value) {
    if (!value && this._layer.background) {
        this._hiddenBackgroundTexture = this._layer.background;
        this._layer.background = null;

    } else if (value && this._hiddenBackgroundTexture) {
        this._layer.background = this._hiddenBackgroundTexture;
        this._hiddenBackgroundTexture = null;

    } else if (this._background) {
        this._background.visible = value;
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
        this._background.traverse(HC.dispose);
    }

    this._hiddenBackgroundTexture = null;
    this._layer.background = null;

    if (recreate !== false) {
        this._background = new THREE.Group();
        this._background.position.x = this.resolution('half').x;
        this._background.position.y = -this.resolution('half').y;
        this._background.name = '_background' + this.index;
        this._layer.add(this._background);
    }
};