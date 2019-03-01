HC.plugins.pattern_mover.stack = _class(false, HC.PatternMoverPlugin, {
    name: 'stack',
    injections: {
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
    },

    init(random) {
        var layer = this.layer;
        var reset = randomInt(0, 6) == 0;
        var inx = [];
        this.index = [];

        for (var i = 0; i < layer.shapeCount(); i++) {
            inx[i] = i;
        }

        while (inx.length > 0) {
            var i = randomInt(0, inx.length - 1);
            var ix = inx[i];
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
    },

    before(shape) {
        var params = this.params(shape);
        params.lx = shape.x();
        params.ly = shape.y();
        params.lz = shape.z();
    },

    apply(shape, shuffle, random) {
        var layer = this.layer;
        var params = this.params(shape);
        var index = shape.index;

        shape.x(params.lx);
        shape.y(params.ly);
        shape.z(params.lz);

        if (!(params.ni) || (index < layer.shapeCount() - 1 && !((index + 1) in layer.shapes))) {

            params.ox = params.nx = shape.x();
            params.oy = params.ny = shape.y();
            params.oz = params.nz = shape.z();
            params.ni = index + 1;

            if (index == 0) {
                this.init(random);
            }

            return;
        }

        var speed = layer.getShapeSpeed(shape);
        var prc = speed.prc;

        if (!shuffle && prc == 0) {
            var bro = layer.shapes[0];

            if (params.ni < layer.shapeCount()) {
                bro = layer.shapes[params.ni++];

            } else {
                params.ni = 1;
            }

            if (bro) {
                var brorams = this.params(bro);
                params.nx = brorams.ox;
                params.ny = brorams.oy;
                params.nz = brorams.oz;
            }

        } else if (shuffle) {
            if (prc == 0) {
                if (index == 0) {
                    this.init(random);
                }

                var ni = this.index[index];
                var bro = layer.shapes[ni];

                if (bro) {
                    var brorams = this.params(bro);
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

                var ni = this.index[index];
                var bro = layer.shapes[ni];
                if (bro) {
                    var brorams = this.params(bro);
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

        var x = params.lx;
        var y = params.ly;
        var z = params.lz;

        var nx = params.nx;
        var ny = params.ny;
        var nz = params.nz;

        var mx = prc * (nx - x);
        var my = prc * (ny - y);
        var mz = prc * (nz - z);

        shape.move(mx, my, mz);
    }

});

HC.plugins.pattern_mover.shuffle = _class(false, HC.PatternMoverPlugin, {
    name: 'shuffle',
    injections: {
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
    },

    init() {
        var layer = this.layer;
        var reset = randomInt(0, 6) == 0;
        var inx = [];
        this.index = [];

        for (var i = 0; i < layer.shapeCount(); i++) {
            inx[i] = i;
        }

        while (inx.length > 0) {
            var i = randomInt(0, inx.length - 1);
            var ix = inx[i];
            if (reset) {
                this.index[this.index.length] = this.index.length;

            } else {
                this.index[this.index.length] = randomInt(0, layer.shapeCount() - 1);
            }

            inx.splice(i, 1);
        }
    },

    before(shape) {

        var params = this.params(shape);
        params.lx = shape.x();
        params.ly = shape.y();
        params.lz = shape.z();
    },

    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        var index = shape.index;

        shape.x(params.lx);
        shape.y(params.ly);
        shape.z(params.lz);

        if (!(params.ni) || (index < layer.shapeCount() - 1 && !((index + 1) in layer.shapes))) {

            params.ox = params.nx = shape.x();
            params.oy = params.ny = shape.y();
            params.oz = params.nz = shape.z();
            params.ni = index + 1;

            if (index == 0) {
                this.init();
            }

            return;
        }

        var speed = layer.getShapeSpeed(shape);
        var prc = speed.prc;

        if (prc == 0) {
            if (index == 0) {
                this.init();
            }

            var ni = this.index[index];
            var bro = layer.shapes[ni];

            if (bro) {
                var brorams = this.params(bro);
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

            var ni = this.index[index];
            var bro = layer.shapes[ni];
            if (bro) {
                var brorams = this.params(bro);
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

        var x = params.lx;
        var y = params.ly;
        var z = params.lz;

        var nx = params.nx;
        var ny = params.ny;
        var nz = params.nz;

        var mx = prc * (nx - x);
        var my = prc * (ny - y);
        var mz = prc * (nz - z);

        shape.move(mx, my, mz);
    }

});

HC.plugins.pattern_mover.xchange = _class(false, HC.PatternMoverPlugin, {
    name: 'xchange',
    injections: {
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
    },

    init() {
        var layer = this.layer;
        var reset = randomInt(0, 6) == 0;
        var inx = [];
        this.index = [];

        for (var i = 0; i < layer.shapeCount(); i++) {
            inx[i] = i;
        }

        while (inx.length > 0) {
            var i = randomInt(0, inx.length - 1);
            var ix = inx[i];

            if (reset) {
                this.index[this.index.length] = this.index.length;

            } else {
                this.index[this.index.length] = ix;
            }

            inx.splice(i, 1);
        }
    },

    before(shape) {

        var params = this.params(shape);
        params.lx = shape.x();
        params.ly = shape.y();
        params.lz = shape.z();
    },

    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        var index = shape.index;

        shape.x(params.lx);
        shape.y(params.ly);
        shape.z(params.lz);

        if (!(params.ni) || (index < layer.shapeCount() - 1 && !((index + 1) in layer.shapes))) {

            params.ox = params.nx = shape.x();
            params.oy = params.ny = shape.y();
            params.oz = params.nz = shape.z();
            params.ni = index + 1;

            if (index == 0) {
                this.init();
            }

            return;
        }

        var speed = layer.getShapeSpeed(shape);
        var prc = speed.prc;

        if (prc == 0) {
            if (index == 0) {
                this.init();
            }

            var ni = this.index[index];
            var bro = layer.shapes[ni];

            if (bro) {
                var brorams = this.params(bro);
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

            var ni = this.index[index];
            var bro = layer.shapes[ni];
            if (bro) {
                var brorams = this.params(bro);
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

        var x = params.lx;
        var y = params.ly;
        var z = params.lz;

        var nx = params.nx;
        var ny = params.ny;
        var nz = params.nz;

        var mx = prc * (nx - x);
        var my = prc * (ny - y);
        var mz = prc * (nz - z);

        shape.move(mx, my, mz);
    }

});
