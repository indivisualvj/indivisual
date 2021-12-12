/**
 * inspired by maptastic
 * @author indivisualvj / https://github.com/indivisualvj
 */
import * as THREE from "three";

const Shapetastic = function (display, animation) {

    let renderer = animation.renderer;
    let ctx = display.canvas.ctx;
    let enabled = false;
    let orientation = 'default';

    /**
     *
     * @returns {number}
     * @private
     */
    let __getIx = function () {
        if (orientation === 'horizontal') {
            return 1;

        }

        return 0;
    };

    /**
     *
     * @returns {number}
     * @private
     */
    let __getIy = function () {
        if (orientation === 'vertical' || orientation === 'horizontal') {
            return 2;
        }

        return 1;
    };

    /**
     *
     * @param e
     * @param vtcs
     * @param fill
     * @private
     */
    let _drawShape = function (e, vtcs, fill) {

        let cx = display.canvas.width / 2;
        let cy = display.canvas.height / 2;
        let m = renderer.currentLayer.shapeSize(.5);

        let ix = __getIx();
        let iy = __getIy();

        if (!vtcs) {
            vtcs = _vtcs();
        }
        let pi = 0;
        if (vtcs.length > 0) {
            ctx.beginPath();
            for (let i = 0; i < vtcs.length; i += 3) {
                let x1 = cx + m * vtcs[i][ix];
                let y1 = cy + m * vtcs[i][iy] * -1;

                ctx.moveTo(x1, y1);
                //ctx.fillText(pi++, x1-5*pi, y1-5*pi);

                if (i + 1 < vtcs.length) {
                    let x2 = cx + m * vtcs[i + 1][ix];
                    let y2 = cy + m * vtcs[i + 1][iy] * -1;
                    ctx.lineTo(x2, y2);
                    //ctx.fillText(pi++, x2-5*pi, y2-5*pi);
                    if (i + 2 < vtcs.length) {
                        let x3 = cx + m * vtcs[i + 2][ix];
                        let y3 = cy + m * vtcs[i + 2][iy] * -1;
                        ctx.lineTo(x3, y3);
                        //ctx.fillText(pi++, x3-5*pi, y3-5*pi);
                    }
                    ctx.lineTo(x1, y1);
                }
            }
            ctx.closePath();
            if (fill) {
                ctx.fillStyle = (fill === true ? '#7b9' : fill);
                ctx.fill();

                ctx.strokeStyle = '#2f2';
                ctx.lineWidth = 1;
                ctx.stroke();

            } else {
                ctx.strokeStyle = '#2f2';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    };

    /**
     *
     * @param e
     * @param fill
     * @param nodist
     * @returns {boolean}
     * @private
     */
    let _drawHandle = function (e, fill, nodist) {

        let vtc = e.x ? _vtc(e) : e;
        let n = _nearest(_vtcs(), vtc);
        let cx = display.canvas.width / 2;
        let cy = display.canvas.height / 2;
        let m = renderer.currentLayer.shapeSize(.5);
        if (n) {

            let vn = new THREE.Vector2(n[0], n[1]);
            let ve = new THREE.Vector2(vtc[0], vtc[1]);
            let d = Math.abs(vn.distanceTo(ve));
            if (nodist || d < .03) {
                let x = cx + n[0] * m;
                let y = cy + n[1] * -m;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.closePath();
                if (fill) {
                    ctx.fillStyle = '#f22';
                    ctx.fill();

                } else {
                    ctx.strokeStyle = '#f22';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                return true;
            }
        }

        return false;
    };

    /**
     *
     * @param e
     * @returns {boolean}
     * @private
     */
    let _drawMover = function (e) {
        let tns = _mtns(e, false);
        if (tns.length === 3) {
            if (_drawHandle(tns[0], true, true)
                && _drawHandle(tns[1], true, true)
                && _drawHandle(tns[2], true, true)
            ) {
                return true;
            }
        }

        return false;
    };

    /**
     *
     * @param e
     * @private
     */
    let _drawCrosshair = function (e) {
        let layer = renderer.currentLayer;
        let cx = display.canvas.width / 2;
        let cy = display.canvas.height / 2;
        let l = cx - layer.shapeSize(.5);
        let r = cx + layer.shapeSize(.5);
        let t = cy - layer.shapeSize(.5);
        let b = cy + layer.shapeSize(.5);

        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(l, t);
        ctx.lineTo(r, b);
        ctx.moveTo(l, b);
        ctx.lineTo(r, t);
        ctx.stroke();

        ctx.strokeRect(display.canvas.width / 2 - layer.shapeSize(.5), display.canvas.height / 2 - layer.shapeSize(.5), layer.shapeSize(1), layer.shapeSize(1));
    };

    /**
     *
     * @param e
     * @private
     */
    let _clear = function (e) {
        let ctx = display.canvas.ctx;
        ctx.clearRect(0, 0, display.canvas.width, display.canvas.height);
    };

    /**
     *
     * @param e
     * @private
     */
    let _drawPosition = function (e) {
        let ctx = display.canvas.ctx;
        let co = _relativeXY(e);
        let x = co.x;
        let y = co.y;
        let rect = display.canvas.getBoundingClientRect();
        let cx = e.x - rect.left;
        let cy = e.y - rect.top;

        cx = cx * (display.canvas.width / rect.width);
        cy = cy * (display.canvas.height / rect.height);

        ctx.font = "16px sans-serif";
        ctx.fillStyle = "yellow";

        let label = [round(x, 4), round(y, 4)].join(' / ');
        ctx.fillText(label, cx + 2, cy - 10);

        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(display.canvas.width, cy);
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, display.canvas.height);
        ctx.stroke();
    };

    let n1, n2;
    /**
     *
     * @param e
     * @param pers
     * @private
     */
    let _verticle = function (e, pers) {
        let vtcs = _vtcs();
        let nu = vtcs.length % 3 === 0;
        let vtc = _vtc(e);
        if (nu) {
            if (vtcs.length < 1) { // add
                vtcs[vtcs.length] = vtc;
            } else { // nu
                if (!pers || !n1) {
                    n1 = _nearest(vtcs, vtc);
                }
                vtcs[vtcs.length] = n1;

                if (!pers || !n2) {
                    n2 = _nearest(vtcs, vtc, n1);
                }
                vtcs[vtcs.length] = n2;
                vtcs[vtcs.length] = vtc;
            }

        } else {
            vtcs[vtcs.length] = vtc;
        }

        return vtcs;
    };

    /**
     *
     * @param e
     * @private
     */
    let _triangle = function (e) {
        let vtcs = _vtcs();
        let vtc = _vtc(e);

        if (vtcs.length < 1) { // add
            vtcs[vtcs.length] = vtc;
        } else { // nu
            let n1 = _nearest(vtcs, vtc);
            vtcs[vtcs.length] = n1;
            let n2 = _nearest(vtcs, vtc, n1);
            vtcs[vtcs.length] = n2;
            let n3 = _nearest(vtcs, vtc, n1, n2);
            vtcs[vtcs.length] = n3;
        }

        return vtcs;
    };

    let mte = false;
    let mtns = [];
    /**
     *
     * @param e
     * @private
     */
    let _moveTriangle = function (e) {
        let vtcs = _vtcs();
        if (!mte) {
            mte = e;
        }

        if (mtns.length === 0) {
            mtns = _mtns(e, true);
        }

        e = _relativeXY(e);
        let me = _relativeXY(mte);
        let deltaX = e.x - me.x;
        let deltaY = e.y - me.y;

        for (let i = 0; i < vtcs.length; i++) {
            for (let m = 0; m < mtns.length; m++) {
                let mt = vtcs[mtns[m].index];
                mt[0] = mtns[m].x + deltaX;
                mt[1] = mtns[m].y - deltaY;
            }
        }

        return vtcs;
    };

    /**
     *
     * @param e
     * @private
     */
    let _deleteTriangle = function (e) {
        let vtcs = _vtcs();
        if (!mte) {
            mte = e;
        }

        if (mtns.length === 0) {
            mtns = _mtns(e, true);
        }
        vtcs.splice(mtns[0].index, 3);

        return vtcs;
    };

    /**
     *
     * @param e
     * @param relative
     * @returns {Array}
     * @private
     */
    let _mtns = function (e, relative) {
        e = _relativeXY(e);
        let vtcs = _vtcs();
        let tns = [];

        for (let i = 0; i < vtcs.length && vtcs.length > 2; i += 3) {
            let v1 = new THREE.Vector3().fromArray(vtcs[i]).setZ(0);
            let v2 = new THREE.Vector3().fromArray(vtcs[i + 1]).setZ(0);
            let v3 = new THREE.Vector3().fromArray(vtcs[i + 2]).setZ(0);
            let vm = new THREE.Vector3(e.x, e.y * -1, 0);

            let t1 = new THREE.Triangle(v1, v2, v3);

            if (t1.containsPoint(vm)) {
                if (relative) {
                    tns = [
                        {index: i, x: v1.x, y: v1.y},
                        {index: i + 1, x: v2.x, y: v2.y},
                        {index: i + 2, x: v3.x, y: v3.y}
                    ];

                } else {
                    tns = [[v1.x, v1.y], [v2.x, v2.y], [v3.x, v3.y]];
                }
                break;
            }
        }

        return tns;
    };

    /**
     *
     * @param e
     * @private
     */
    let _move = function (e) {
        let vtcs = _vtcs();
        _drawHandle(e);
        let vt = _vtc(e);
        let n = _nearest(vtcs, vt, n1);

        if (n) {
            let v1 = new THREE.Vector2(vt[0], vt[1]);
            let v2 = new THREE.Vector2(n[0], n[1]);
            let d = v1.distanceTo(v2);

            if (Math.abs(d) < .02) {
                _drawHandle(e, true);
                vt = n;
            }
        }

        for (let i = 0; i < vtcs.length; i++) {
            let vtc = vtcs[i];
            if (vtc[0] === n1[0] && vtc[1] === n1[1]) {
                vtcs[i][0] = vt[0];
                vtcs[i][1] = vt[1];
            }
        }

        return vtcs;
    };

    /**
     *
     * @param x
     * @param y
     * @private
     */
    let _moveShape = function (x, y) {
        let vtcs = _vtcs();
        for (let i = 0; i < vtcs.length; i++) {
            vtcs[i][0] += x;
            vtcs[i][1] -= y;
        }

        return vtcs;
    };

    /**
     *
     * @param x
     * @param y
     * @private
     */
    let _scaleShape = function (x, y) {
        let vtcs = _vtcs();
        for (let i = 0; i < vtcs.length; i++) {
            vtcs[i][0] *= x;
            vtcs[i][1] *= y;
        }

        return vtcs;
    };

    /**
     *
     * @param vtcs
     * @param tc
     * @param not
     * @param notnot
     * @returns {*}
     * @private
     */
    let _nearest = function (vtcs, tc, not, notnot) {
        let nrst = false;
        for (let i = 0; i < vtcs.length; i++) {
            let vt = vtcs[i];

            if (not && not[0] === vt[0] && not[1] === vt[1]) {
                continue;

            } else if (notnot && notnot[0] === vt[0] && notnot[1] === vt[1]) {
                continue;
            }

            let dx = Math.abs(vt[0] - tc[0]);
            let dy = Math.abs(vt[1] - tc[1]);
            let vec = new THREE.Vector2(dx, dy);

            if (!nrst || vec.length() < nrst[0].length()) {
                nrst = [vec, i];
            }
        }

        return vtcs[nrst[1]];
    };

    /**
     *
     * @returns {*}
     * @private
     */
    let _vtcs = function () {
        let vertices = renderer.currentLayer.settings.shape_vertices;
        vertices = '[' + vertices + ']';
        return JSON.parse(vertices);
    };

    /**
     *
     * @param e
     * @returns {{x: number, y: number}}
     * @private
     */
    let _relativeXY = function (e) {
        let rect = display.canvas.getBoundingClientRect();
        let x = e.x - rect.left;
        let y = e.y - rect.top;

        let cx = x * (display.canvas.width / rect.width);
        let cy = y * (display.canvas.height / rect.height);

        let cntx = display.canvas.width / 2;
        let cnty = display.canvas.height / 2;
        x = cx - cntx;
        y = cy - cnty;
        x = x / renderer.currentLayer.shapeSize(.5);
        y = y / renderer.currentLayer.shapeSize(.5);

        return {x: x, y: y};
    };

    /**
     *
     * @param e
     * @returns {number[]}
     * @private
     */
    let _vtc = function (e) {
        e = _relativeXY(e);
        let x = e.x;
        let y = e.y;

        return [x, y * -1, 0];
    };

    let shiftMouseDown = false;
    let ctrlShiftMouseDown = false;
    let mouseDown = false;
    let movingVerticle = false;
    let movingTriangle = false;

    window.addEventListener('mousemove', function (e) {
        if (!enabled) {
            return;
        }
        _clear(e);
        _drawCrosshair(e);

        if (e.shiftKey) {

            if (e.shiftKey && e.ctrlKey) {
                _drawShape(e, _triangle(e), true);

            } else if (e.shiftKey) { // shape vertices setter
                _drawShape(e, _verticle(e, shiftMouseDown));

            } else {
                //_drawShape(e, _vtcs());
            }

            _drawPosition(e);

        } else if (!e.shiftKey && !e.ctrlKey && !e.altKey) {

            if (movingVerticle) {
                _drawShape(e, _move(e));
                _drawPosition(e);

            } else if (movingTriangle) {
                _drawShape(e, _moveTriangle(e));

            } else {
                _drawShape(e, _vtcs());
                if (!_drawHandle(e)) {
                    _drawMover(e);
                }
            }

        } else if (e.ctrlKey && !e.shiftKey && !e.altKey) {
            _drawShape(e, _vtcs(), '#b89');
            _drawMover(e);
        }
    });

    /**
     *
     * @param vtcs
     * @param jo
     * @private
     */
    let _saveVertices = function (vtcs, jo) {

        for (let i = 0; i < vtcs.length; i++) {
            vtcs[i][0] = round(vtcs[i][0], 3);
            vtcs[i][1] = round(vtcs[i][1], 3);
        }

        let vertices = JSON.stringify(vtcs);
        vertices = vertices.replace(/\.(\d{4})(\d+)/gm, '.$1');

        vertices = vertices.slice(1, vertices.length - 1);

        animation.updateSetting(animation.config.ControlSettings.layer, {'shape': {'shape_vertices': vertices}}, jo, jo, false);
    };

    /**
     *
     * @param e
     */
    let mousedown = function (e) {

        if (!enabled) {
            return;
        }

        if (e.shiftKey && e.ctrlKey) {
            ctrlShiftMouseDown = true;
            _drawShape(e, _triangle(e), true);

        } else if (e.shiftKey) {
            shiftMouseDown = true;
            _drawShape(e, _verticle(e, true));

        } else if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
            mouseDown = true;
            let vtc = _vtc(e);
            n1 = _nearest(_vtcs(), vtc);
            movingVerticle = _drawHandle(e);
            if (!movingVerticle) {
                movingTriangle = _drawMover(e);
            }
        }
    };
    window.addEventListener('mousedown', mousedown);

    window.addEventListener('mouseup', function (e) {
        if (!enabled) {
            return;
        }
        if (shiftMouseDown) {
            let vtcs = _verticle(e, true);
            let cpl = (vtcs.length % 3 === 0);
            _saveVertices(vtcs, cpl);

            n1 = false;
            n2 = false;

        } else if (ctrlShiftMouseDown) {
            let vtcs = _triangle(e);
            _saveVertices(vtcs, true);

        } else if (movingVerticle) {
            movingVerticle = false;
            let vtcs = _move(e);
            _saveVertices(vtcs, true);

        } else if (movingTriangle) {
            movingTriangle = false;
            let vtcs = _moveTriangle(e);

            _saveVertices(vtcs, true);

            mtns = [];
            mte = false;

        } else if (e.ctrlKey && !e.altKey && !e.shiftKey) {

            let vtcs = _deleteTriangle(e);

            _saveVertices(vtcs, true);

            mtns = [];
            mte = false;
        }

        shiftMouseDown = false;
        ctrlShiftMouseDown = false;
        mouseDown = false;
    });

    window.addEventListener('keyup', function (e) {

        if (e.keyCode === 83) {
            enabled = !enabled;
        }

        if (!enabled) {
            _clear(e);
            return;
        } else {
            _clear(e);
            _drawCrosshair(e);
        }

        if (e.keyCode === 37) { // left-arrow

            if (e.shiftKey) {
                let vtcs = _scaleShape(0.975, 1);
                _saveVertices(vtcs, true);
            } else {
                let vtcs = _moveShape(-0.025, 0);
                _saveVertices(vtcs, true);
            }

        } else if (e.keyCode === 39) { // right-arrow
            if (e.shiftKey) {
                let vtcs = _scaleShape(1.025, 1);
                _saveVertices(vtcs, true);

            } else {
                let vtcs = _moveShape(0.025, 0);
                _saveVertices(vtcs, true);
            }

        } else if (e.keyCode === 40) { // down-arrow
            if (e.shiftKey) {
                let vtcs = _scaleShape(1, 0.975);
                _saveVertices(vtcs, true);

            } else {
                let vtcs = _moveShape(0, 0.025);
                _saveVertices(vtcs, true);
            }

        } else if (e.keyCode === 38) { // up-arrow
            if (e.shiftKey) {
                let vtcs = _scaleShape(1, 1.025);
                _saveVertices(vtcs, true);

            } else {
                let vtcs = _moveShape(0, -0.025);
                _saveVertices(vtcs, true);
            }

        } else if (e.keyCode === 27) {
            shiftMouseDown = false;
            ctrlShiftMouseDown = false;
            mouseDown = false;
            n1 = false;
            n2 = false;
        }

        _drawShape(e);
    });

    /**
     *
     * @param e
     */
    let keydown = function (e) {
        if (!enabled) {
            return;
        }
        if (e.shiftKey && e.ctrlKey) {
            _clear(e);
            _drawCrosshair(e);
            _drawShape(e, _triangle(e), true);

        } else if (e.ctrlKey) {
            _clear(e);
            _drawCrosshair(e);
            _drawShape(e, _vtcs(), false);

        } else if (e.shiftKey) {

        } else if (e.altKey) {

        }
    };
    window.addEventListener('keydown', keydown);


    return {
        destroy: function () {
            window.removeEventListener('keydown', keydown);
            window.removeEventListener('mousedown', mousedown);
        }
    };
};

export {Shapetastic};
