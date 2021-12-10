/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternMoverPlugin} from "../PatternMoverPlugin";

class stack extends PatternMoverPlugin {
    static name = 'stack';
    injections = {
        ox: false,
        oy: false,
        oz: false,
        nx: false,
        ny: false,
        nz: false,
        lx: false,
        ly: false,
        lz: false,
        ni: false,
        xf: false
    };

    init(random) {
        let layer = this.layer;
        let reset = randomInt(0, 6) === 0;
        let inx = [];
        this.index = [];

        for (let i = 0; i < layer.shapeCount(); i++) {
            inx[i] = i;
        }

        while (inx.length > 0) {
            let i = randomInt(0, inx.length - 1);
            let ix = inx[i];
            if (random) {
                if (reset) {
                    this.index[this.index.length] = this.index.length;

                } else {
                    this.index[this.index.length] = randomInt(0, layer.shapeCount() - 1);
                }

            } else {

                if (reset) {
                    this.index[this.index.length] = this.index.length;

                } else {
                    this.index[this.index.length] = ix;
                }
            }

            inx.splice(i, 1);
        }
    }

    before(shape) {
        let params = this.params(shape);
        params.lx = shape.x();
        params.ly = shape.y();
        params.lz = shape.z();
    }

    apply(shape, shuffle, random) {
        let layer = this.layer;
        let params = this.params(shape);
        let index = shape.index;

        shape.x(params.lx);
        shape.y(params.ly);
        shape.z(params.lz);

        if (!(params.ni) || (index < layer.shapeCount() - 1 && !((index + 1) in layer.shapes))) {

            params.ox = params.nx = shape.x();
            params.oy = params.ny = shape.y();
            params.oz = params.nz = shape.z();
            params.ni = index + 1;

            if (index === 0) {
                this.init(random);
            }

            return;
        }

        let speed = layer.shapeSpeed(shape);
        let prc = speed.prc;

        if (!shuffle && prc === 0) {
            let bro = layer.getShape(0);

            if (params.ni < layer.shapeCount()) {
                bro = layer.getShape(params.ni++);

            } else {
                params.ni = 1;
            }

            if (bro) {
                let brorams = this.params(bro);
                params.nx = brorams.ox;
                params.ny = brorams.oy;
                params.nz = brorams.oz;
            }

        } else if (shuffle) {
            if (prc === 0) {
                if (index === 0) {
                    this.init(random);
                }

                let ni = this.index[index];
                let bro = layer.getShape(ni);

                if (bro) {
                    let brorams = this.params(bro);
                    params.xf = randomInt(0, 1);
                    if (params.xf) {
                        params.nx = brorams.ox;
                        params.nz = brorams.oz;

                    } else {
                        params.ny = brorams.oy;
                        params.nz = params.oz;
                    }

                }

            } else if (prc >= 0.5) {
                prc = (prc - 0.5) * 2;

                let ni = this.index[index];
                let bro = layer.getShape(ni);
                if (bro) {
                    let brorams = this.params(bro);
                    if (!params.xf) {
                        params.nx = brorams.ox;
                        params.nz = brorams.oz;

                    } else {
                        params.ny = brorams.oy;
                        params.nz = params.oz;
                    }
                }

            } else {
                prc *= 2;
            }
        }

        let x = params.lx;
        let y = params.ly;
        let z = params.lz;

        let nx = params.nx;
        let ny = params.ny;
        let nz = params.nz;

        let mx = prc * (nx - x);
        let my = prc * (ny - y);
        let mz = prc * (nz - z);

        shape.move(mx, my, mz);
    }
}


class shuffle extends PatternMoverPlugin {
    static name = 'shuffle';
    injections = {
        ox: false,
        oy: false,
        oz: false,
        nx: false,
        ny: false,
        nz: false,
        lx: false,
        ly: false,
        lz: false,
        ni: false,
        xf: false
    };

    init() {
        let layer = this.layer;
        let reset = randomInt(0, 6) === 0;
        let inx = [];
        this.index = [];

        for (let i = 0; i < layer.shapeCount(); i++) {
            inx[i] = i;
        }

        while (inx.length > 0) {
            let i = randomInt(0, inx.length - 1);
            let ix = inx[i];
            if (reset) {
                this.index[this.index.length] = this.index.length;

            } else {
                this.index[this.index.length] = randomInt(0, layer.shapeCount() - 1);
            }

            inx.splice(i, 1);
        }
    }

    before(shape) {

        let params = this.params(shape);
        params.lx = shape.x();
        params.ly = shape.y();
        params.lz = shape.z();
    }

    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        let index = shape.index;

        shape.x(params.lx);
        shape.y(params.ly);
        shape.z(params.lz);

        if (!(params.ni) || (index < layer.shapeCount() - 1 && !((index + 1) in layer.shapes))) {

            params.ox = params.nx = shape.x();
            params.oy = params.ny = shape.y();
            params.oz = params.nz = shape.z();
            params.ni = index + 1;

            if (index === 0) {
                this.init();
            }

            return;
        }

        let speed = layer.shapeSpeed(shape);
        let prc = speed.prc;

        if (prc === 0) {
            if (index === 0) {
                this.init();
            }

            let ni = this.index[index];
            let bro = layer.getShape(ni);

            if (bro) {
                let brorams = this.params(bro);
                params.xf = randomInt(0, 1);
                if (params.xf) {
                    params.nx = brorams.ox;
                    params.nz = brorams.oz;

                } else {
                    params.ny = brorams.oy;
                    params.nz = params.oz;
                }

            }

        } else if (prc >= 0.5) {
            prc = (prc - 0.5) * 2;

            let ni = this.index[index];
            let bro = layer.getShape(ni);
            if (bro) {
                let brorams = this.params(bro);
                if (!params.xf) {
                    params.nx = brorams.ox;
                    params.nz = brorams.oz;

                } else {
                    params.ny = brorams.oy;
                    params.nz = params.oz;
                }
            }

        } else {
            prc *= 2;
        }

        let x = params.lx;
        let y = params.ly;
        let z = params.lz;

        let nx = params.nx;
        let ny = params.ny;
        let nz = params.nz;

        let mx = prc * (nx - x);
        let my = prc * (ny - y);
        let mz = prc * (nz - z);

        shape.move(mx, my, mz);
    }
}


class xchange extends PatternMoverPlugin {
    static name = 'xchange';
    injections = {
        ox: false,
        oy: false,
        oz: false,
        nx: false,
        ny: false,
        nz: false,
        lx: false,
        ly: false,
        lz: false,
        ni: false,
        xf: false
    };

    init() {
        let layer = this.layer;
        let reset = randomInt(0, 6) === 0;
        let inx = [];
        this.index = [];

        for (let i = 0; i < layer.shapeCount(); i++) {
            inx[i] = i;
        }

        while (inx.length > 0) {
            let i = randomInt(0, inx.length - 1);
            let ix = inx[i];

            if (reset) {
                this.index[this.index.length] = this.index.length;

            } else {
                this.index[this.index.length] = ix;
            }

            inx.splice(i, 1);
        }
    }

    before(shape) {

        let params = this.params(shape);
        params.lx = shape.x();
        params.ly = shape.y();
        params.lz = shape.z();
    }

    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        let index = shape.index;

        shape.x(params.lx);
        shape.y(params.ly);
        shape.z(params.lz);

        if (!(params.ni) || (index < layer.shapeCount() - 1 && !((index + 1) in layer.shapes))) {

            params.ox = params.nx = shape.x();
            params.oy = params.ny = shape.y();
            params.oz = params.nz = shape.z();
            params.ni = index + 1;

            if (index === 0) {
                this.init();
            }

            return;
        }

        let speed = layer.shapeSpeed(shape);
        let prc = speed.prc;

        if (prc === 0) {
            if (index === 0) {
                this.init();
            }

            let ni = this.index[index];
            let bro = layer.getShape(ni);

            if (bro) {
                let brorams = this.params(bro);
                params.xf = randomInt(0, 1);
                if (params.xf) {
                    params.nx = brorams.ox;
                    params.nz = brorams.oz;

                } else {
                    params.ny = brorams.oy;
                    params.nz = params.oz;
                }

            }

        } else if (prc >= 0.5) {
            prc = (prc - 0.5) * 2;

            let ni = this.index[index];
            let bro = layer.getShape(ni);
            if (bro) {
                let brorams = this.params(bro);
                if (!params.xf) {
                    params.nx = brorams.ox;
                    params.nz = brorams.oz;

                } else {
                    params.ny = brorams.oy;
                    params.nz = params.oz;
                }
            }

        } else {
            prc *= 2;
        }

        let x = params.lx;
        let y = params.ly;
        let z = params.lz;

        let nx = params.nx;
        let ny = params.ny;
        let nz = params.nz;

        let mx = prc * (nx - x);
        let my = prc * (ny - y);
        let mz = prc * (nz - z);

        shape.move(mx, my, mz);
    }
}

export {shuffle, stack, xchange};
