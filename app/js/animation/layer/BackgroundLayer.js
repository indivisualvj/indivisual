/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {_Layer} from "./AnimatedLayer";
import * as HC from "../../shared/Three";
import {Color, Group, Object3D, Texture} from "three";

class Layer extends _Layer {


    /**
     *
     * @param value
     */
    setBackground(value) {

        this._resetBackground(false);

        if (value instanceof Object3D) {
            this._resetBackground(true);
            this._background.add(value);
        }
        if (value instanceof Color || value instanceof Texture) {
            this._layer.background = value;
        }
    }

    /**
     *
     * @param value
     */
    setBackgroundVisible(value) {
        if (!value && this._layer.background) {
            this._hiddenBackgroundTexture = this._layer.background;
            this._layer.background = null;

        } else if (value && this._hiddenBackgroundTexture) {
            this._layer.background = this._hiddenBackgroundTexture;
            this._hiddenBackgroundTexture = null;

        } else if (this._background) {
            this._background.visible = value;
        }
    }

    /**
     *
     * @param recreate
     * @protected
     */
    _resetBackground(recreate) {
        if (this._background) {
            this._layer.remove(this._background);
            this._background.traverse(HC.dispose);
        }

        this._hiddenBackgroundTexture = null;
        this._layer.background = null;

        if (recreate !== false) {
            this._background = new Group();
            this._background.position.x = this.resolution('half').x;
            this._background.position.y = -this.resolution('half').y;
            this._background.name = '_background' + this.index;
            this._layer.add(this._background);
        }
    }
}

export {Layer as _Layer}