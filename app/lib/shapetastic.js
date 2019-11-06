var Shapetastic = function(inst) {

    var ctx = inst.canvas.ctx;
    var enabled = false;
    var orientation = 'default';

    /**
     *
     * @returns {number}
     * @private
     */
    var __getIx = function () {
        if (orientation == 'horizontal') {
            return 1;

        }

        return 0;
    };

    /**
     *
     * @returns {number}
     * @private
     */
    var __getIy = function () {
        if (orientation == 'vertical' || orientation == 'horizontal') {
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
    var _drawShape = function (e, vtcs, fill) {

        var cx = inst.canvas.width / 2;
        var cy = inst.canvas.height / 2;
        var m = renderer.currentLayer.shapeSize(.5);

        var ix = __getIx();
        var iy = __getIy();

        if (!vtcs) {
            vtcs = _vtcs();
        }
        var pi = 0;
        if (vtcs.length > 0) {
            ctx.beginPath();
            for (var i = 0; i < vtcs.length; i+=3) {
                var x1 = cx+m*vtcs[i][ix];
                var y1 = cy+m*vtcs[i][iy]*-1;

                ctx.moveTo(x1, y1);
                //ctx.fillText(pi++, x1-5*pi, y1-5*pi);

                if (i+1 < vtcs.length) {
                    var x2 = cx+m*vtcs[i+1][ix];
                    var y2 = cy+m*vtcs[i+1][iy]*-1;
                    ctx.lineTo(x2, y2);
                    //ctx.fillText(pi++, x2-5*pi, y2-5*pi);
                    if (i+2 < vtcs.length) {
                        var x3 = cx+m*vtcs[i+2][ix];
                        var y3 = cy+m*vtcs[i+2][iy]*-1;
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
    var _drawHandle = function (e, fill, nodist) {

        var vtc = e.x?_vtc(e):e;
        var n = _nearest(_vtcs(), vtc);
        var cx = inst.canvas.width / 2;
        var cy = inst.canvas.height / 2;
        var m = renderer.currentLayer.shapeSize(.5);
        if (n) {

            var vn = new THREE.Vector2(n[0], n[1]);
            var ve = new THREE.Vector2(vtc[0], vtc[1]);
            var d = Math.abs(vn.distanceTo(ve));
            if (nodist || d < .03) {
                var x = cx + n[0] * m;
                var y = cy + n[1] * -m;
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
    var _drawMover = function (e) {
        var tns = _mtns(e, false);
        if (tns.length == 3) {
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
    var _drawCrosshair = function (e) {
        var layer = renderer.currentLayer;
        var cx = inst.canvas.width/2;
        var cy = inst.canvas.height/2;
        var l = cx - layer.shapeSize(.5);
        var r = cx + layer.shapeSize(.5);
        var t = cy - layer.shapeSize(.5);
        var b = cy + layer.shapeSize(.5);

        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(l, t);
        ctx.lineTo(r, b);
        ctx.moveTo(l, b);
        ctx.lineTo(r, t);
        ctx.stroke();

        ctx.strokeRect(inst.canvas.width/2 - layer.shapeSize(.5), inst.canvas.height/2 - layer.shapeSize(.5), layer.shapeSize(1), layer.shapeSize(1));
    };

    /**
     *
     * @param e
     * @private
     */
    var _clear = function (e) {
        var ctx = inst.canvas.ctx;
        ctx.clearRect(0, 0, inst.canvas.width, inst.canvas.height);
    };

    /**
     *
     * @param e
     * @private
     */
    var _drawPosition = function (e) {
        var ctx = inst.canvas.ctx;
        var co = _relativeXY(e);
        var x = co.x;
        var y = co.y;
        var rect = inst.canvas.getBoundingClientRect();
        var cx = e.x - rect.left;
        var cy = e.y - rect.top;

        var cx = cx * (inst.canvas.width / rect.width);
        var cy = cy * (inst.canvas.height / rect.height);

        ctx.font="16px sans-serif";
        ctx.fillStyle = "yellow";

        var label = [round(x, 4), round(y, 4)].join(' / ');
        ctx.fillText(label, cx + 2, cy - 10);

        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(inst.canvas.width, cy);
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, inst.canvas.height);
        ctx.stroke();
    };

    var n1, n2;
    /**
     *
     * @param e
     * @param pers
     * @private
     */
    var _verticle = function (e, pers) {
        var vtcs = _vtcs();
        var nu = vtcs.length % 3 == 0;
        var vtc = _vtc(e);
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
    var _triangle = function (e) {
        var vtcs = _vtcs();
        var vtc = _vtc(e);

        if (vtcs.length < 1) { // add
            vtcs[vtcs.length] = vtc;
        } else { // nu
            var n1 = _nearest(vtcs, vtc);
            vtcs[vtcs.length] = n1;
            var n2 = _nearest(vtcs, vtc, n1);
            vtcs[vtcs.length] = n2;
            var n3 = _nearest(vtcs, vtc, n1, n2);
            vtcs[vtcs.length] = n3;
        }

        return vtcs;
    };

    var mte = false;
    var mtns = [];
    /**
     *
     * @param e
     * @private
     */
    var _moveTriangle = function (e) {
        var vtcs = _vtcs();
        if (!mte) {
            mte = e;
        }

        if (mtns.length == 0) {
            mtns = _mtns(e, true);
        }

        var e = _relativeXY(e);
        var me = _relativeXY(mte);
        var deltaX = e.x - me.x;
        var deltaY = e.y - me.y;

        for (var i = 0; i < vtcs.length; i++) {
            for (var m = 0; m < mtns.length; m++) {
                var mt = vtcs[mtns[m].index];
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
    var _deleteTriangle = function (e) {
        var vtcs = _vtcs();
        if (!mte) {
            mte = e;
        }

        if (mtns.length == 0) {
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
    var _mtns = function (e, relative) {
        e = _relativeXY(e);
        var vtcs = _vtcs();
        var tns = [];

        if (true) {

            for (var i = 0; i < vtcs.length && vtcs.length > 2; i += 3) {
                var v1 = new THREE.Vector3().fromArray(vtcs[i]).setZ(0);
                var v2 = new THREE.Vector3().fromArray(vtcs[i + 1]).setZ(0);
                var v3 = new THREE.Vector3().fromArray(vtcs[i + 2]).setZ(0);
                var vm = new THREE.Vector3(e.x, e.y*-1, 0);

                var t1 = new THREE.Triangle(v1, v2, v3);

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
        }

        return tns;
    };

    /**
     *
     * @param e
     * @private
     */
    var _move = function (e) {
        var vtcs = _vtcs();
        _drawHandle(e);
        var vt = _vtc(e);
        var n = _nearest(vtcs, vt, n1);

        if (n) {
            var v1 = new THREE.Vector2(vt[0], vt[1]);
            var v2 = new THREE.Vector2(n[0], n[1]);
            var d  = v1.distanceTo(v2);
        }

        if (Math.abs(d) < .02) {
            _drawHandle(e, true);
            vt = n;
        }

        for (var i = 0; i < vtcs.length; i++) {
            var vtc = vtcs[i];
            if (vtc[0] == n1[0] && vtc[1] == n1[1]) {
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
    var _moveShape = function (x, y) {
        var vtcs = _vtcs();
        for (var i = 0; i < vtcs.length; i++) {
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
    var _scaleShape = function (x, y) {
        var vtcs = _vtcs();
        for (var i = 0; i < vtcs.length; i++) {
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
    var _nearest = function (vtcs, tc, not, notnot) {
        var nrst = false;
        for (var i = 0; i < vtcs.length; i++) {
            var vt = vtcs[i];

            if (not && not[0] == vt[0] && not[1] == vt[1]) {
                continue;

            } else if (notnot && notnot[0] == vt[0] && notnot[1] == vt[1]) {
                continue;
            }

            var dx = Math.abs(vt[0] - tc[0]);
            var dy = Math.abs(vt[1] - tc[1]);
            var vec = new THREE.Vector2(dx, dy);

            if (!nrst || vec.length() < nrst[0].length()) {
                nrst = [vec, i];
            }
        }

        var vtc = vtcs[nrst[1]];
        return vtc;
    };

    /**
     *
     * @returns {*}
     * @private
     */
    var _vtcs = function () {
        var vertices = renderer.currentLayer.settings.shape_vertices;
        vertices = '[' + vertices + ']';
        return JSON.parse(vertices);
    };

    /**
     *
     * @param e
     * @returns {{x: number, y: number}}
     * @private
     */
    var _relativeXY = function (e) {
        var rect = inst.canvas.getBoundingClientRect();
        var x = e.x - rect.left;
        var y = e.y - rect.top;

        var cx = x * (inst.canvas.width / rect.width);
        var cy = y * (inst.canvas.height / rect.height);

        var cntx = inst.canvas.width / 2;
        var cnty = inst.canvas.height / 2;
        x = cx - cntx;
        y = cy - cnty;
        x = x / renderer.currentLayer.shapeSize(.5), 3;
        y = y / renderer.currentLayer.shapeSize(.5), 3;

        return {x: x, y: y};
    };

    /**
     *
     * @param e
     * @returns {number[]}
     * @private
     */
    var _vtc = function (e) {
        var e = _relativeXY(e);
        var x = e.x;
        var y = e.y;

        return [x, y * -1, 0];
    };

    var shiftMouseDown = false;
    var ctrlShiftMouseDown = false;
    var mouseDown = false;
    var movingVerticle = false;
    var movingTriangle = false;

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
    var _saveVertices = function (vtcs, jo) {

        for (i = 0; i < vtcs.length; i++) {
            vtcs[i][0] = round(vtcs[i][0], 3);
            vtcs[i][1] = round(vtcs[i][1], 3);
        }

        var vertices = JSON.stringify(vtcs);
        vertices = vertices.replace(/\.(\d{4})(\d+)/gm, '.$1');

        vertices = vertices.slice(1, vertices.length - 1);

        animation.updateSetting(statics.ControlSettings.layer, 'shape_vertices', vertices, jo, jo);
    };

    /**
     *
     * @param e
     */
    var mousedown = function (e) {

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
            var vtc = _vtc(e);
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
            var vtcs = _verticle(e, true);
            var cpl = (vtcs.length%3==0);
            _saveVertices(vtcs, cpl);

            n1 = false;
            n2 = false;

        } else if (ctrlShiftMouseDown) {
            var vtcs = _triangle(e);
            _saveVertices(vtcs, true);

        } else if (movingVerticle) {
            movingVerticle = false;
            var vtcs = _move(e);
            _saveVertices(vtcs, true);

        } else if (movingTriangle) {
            movingTriangle = false;
            var vtcs = _moveTriangle(e);

            _saveVertices(vtcs, true);

            mtns = [];
            mte = false;

        } else if (e.ctrlKey && !e.altKey && !e.shiftKey) {

            var vtcs = _deleteTriangle(e);

            _saveVertices(vtcs, true);

            mtns = [];
            mte = false;
        }

        shiftMouseDown = false;
        ctrlShiftMouseDown = false;
        mouseDown = false;
    });

    window.addEventListener('keyup', function (e) {

        if (e.keyCode == 83) {
            enabled = !enabled;
        }

        if (!enabled) {
            _clear(e);
            return;
        } else {
            _clear(e);
            _drawCrosshair(e);
        }

        if (e.keyCode == 37) { // left-arrow

            if (e.shiftKey) {
                var vtcs = _scaleShape(0.975, 1);
                _saveVertices(vtcs, true);
            } else {
                var vtcs = _moveShape(-0.025, 0);
                _saveVertices(vtcs, true);
            }

        } else if (e.keyCode == 39) { // right-arrow
            if (e.shiftKey) {
                var vtcs = _scaleShape(1.025, 1);
                _saveVertices(vtcs, true);

            } else {
                var vtcs = _moveShape(0.025, 0);
                _saveVertices(vtcs, true);
            }

        } else if (e.keyCode == 40) { // down-arrow
            if (e.shiftKey) {
                var vtcs = _scaleShape(1, 0.975);
                _saveVertices(vtcs, true);

            } else {
                var vtcs = _moveShape(0, 0.025);
                _saveVertices(vtcs, true);
            }

        } else if (e.keyCode == 38) { // up-arrow
            if (e.shiftKey) {
                var vtcs = _scaleShape(1, 1.025);
                _saveVertices(vtcs, true);

            } else {
                var vtcs = _moveShape(0, -0.025);
                _saveVertices(vtcs, true);
            }

        } else if (e.keyCode == 27) {
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
    var keydown = function (e) {
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