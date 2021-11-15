/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.GeometryBackgroundModePlugin = class GeometryBackgroundModePlugin extends HC.BackgroundModePlugin {
        mesh;
        disposables = [];

        after() {
            if (this.mesh && this.mesh.material) {
                let mat = this.mesh.material;
                let keys = Object.keys(mat);
                for (let k in keys) {
                    let key = keys[k];
                    if (mat[key] instanceof THREE.Texture) {
                        let texture = mat[key];
                        this.updateTexture(texture, 'background');
                    }
                }
            }
        }

        reset() {
            this.dispose();
        }

        addDisposable(obj) {
            this.disposables.push(obj);
        }

        dispose() {
            for (const disposable of this.disposables) {
                if (disposable.traverse) {
                    disposable.traverse(threeDispose);
                } else {
                    disposable.dispose();
                }
            }
        }
    }
}
