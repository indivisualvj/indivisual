/**
 *
 * @param config
 * @returns {{setConfigEnabled: Function, getConfigEnabled: Function, addLayer: Function, removeLayer: Function}}
 * @constructor
 */
var Cliptastic = function(config) {

    var getProp = function(cfg, key, defaultVal){
        if(cfg && cfg.hasOwnProperty(key) && (cfg[key] !== null)) {
            return cfg[key];
        } else {
            return defaultVal;
        }
    };

    var layoutChangeListener = getProp(config, 'onchange', function(element){} );

    var layers = [];

    var configActive = false;

    var dragging = false;

    var selectedLayer = null;
    var selectedPoint = null;
    var selectionRadius = 20;
    var hoveringPoint = null;
    var hoveringLayer = null;

    var _mousePosition = [];
    var _mouseDelta = [];
    var mousePosition = [];
    var mouseDelta = [];

    var distanceTo = function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    var pointInLayer = function(point, layer) {
        point = convertPointFromPageToNode(layer.overlay, point[0], point[1]);
        var b = layer.element.bounds;
        var a = point.x > b.x && point.x < b.x + b.width;
        var c = point.y > b.y && point.y < b.y + b.height;

        return a && c;
    };

    var notifyChangeListener = function(element) {
        layoutChangeListener(element);
    };

    var clear = function () {
        for(var i = 0; i < layers.length; i++) {
            var l = layers[i];
            if (l.overlay) {
                document.body.removeChild(l.overlay);
            }
            l.overlay = false;
        }
    };

    var draw = function() {
        if(!configActive){
            return;
        }

        for(var i = 0; i < layers.length; i++) {
            var l = layers[i];

            var e = l.element;
            var tp = l.targetPoints;
            var context = e.ctx;
            var canvas = context.canvas;

            if (!l.overlay) {
                l.overlay = document.createElement('canvas');
                l.overlay.ctx = l.overlay.getContext('2d');
                document.body.appendChild(l.overlay);
            }

            context = l.overlay.ctx;
            l.overlay.width = canvas.width;
            l.overlay.height = canvas.height;
            l.overlay.setAttribute('style', canvas.getAttribute('style'));


            if (l == selectedLayer) {
                l.overlay.style.outline = '1px solid blue';
            } else {
                l.overlay.style.outline = 'none';
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.globalAlpha = 0.25;
            context.fillStyle = '#444';
            var b = e.bounds;
            context.fillRect(b.x, b.y, b.width, b.height);
            context.strokeStyle = "red";
            context.lineWidth = 3;

            // Draw layer rectangles.
            context.beginPath();
            if(l === hoveringLayer){
                context.strokeStyle = "red";
                context.globalAlpha = 1;
            } else if(l === selectedLayer){
                context.strokeStyle = "red";
                context.globalAlpha = 1;
            } else {
                context.strokeStyle = "#5f5";
                context.globalAlpha = 1;
            }
            context.moveTo(tp[0][0], tp[0][1]);
            for(var p = 1; p < tp.length; p++) {
                context.lineTo(tp[p][0], tp[p][1]);
            }
            context.lineTo(tp[0][0], tp[0][1]);
            context.closePath();
            context.stroke();

            // Draw corner points.
            for(var p = 0; p < tp.length; p++) {

                if(tp[p] === hoveringPoint){
                    context.strokeStyle = "red";
                } else if( tp[p] === selectedPoint ) {
                    context.strokeStyle = "red";
                } else if (l === selectedLayer) {
                    context.strokeStyle = "#fff";
                } else {
                    context.strokeStyle = "#5f5";
                }

                context.beginPath();
                context.arc(tp[p][0], tp[p][1], selectionRadius, 0, 2 * Math.PI, false);
                context.stroke();
            }

            context.globalAlpha = (layers[i] == selectedLayer || layers[i] == hoveringLayer) ? 1: 0.25;
            if(true) {
                // Draw the element ID in the center of the quad for reference.
                var label = layers[i].element.id.toUpperCase();
                context.font="17px sans-serif";
                context.textAlign = "center";
                var metrics = context.measureText(label);
                var size = [metrics.width + 8, 12 + 12];
                if(layers[i] === hoveringLayer){
                    context.fillStyle = "#f22";
                } else if(layers[i] === selectedLayer){
                    context.fillStyle = "#f22";
                } else {
                    context.fillStyle = "white";
                }
                var cp = centerPoint(layers[i]);
                context.fillRect(cp[0] - size[0] / 2, cp[1] - size[1] + 6, size[0], size[1]);
                context.fillStyle = "black";
                context.fillText(label, cp[0], cp[1]);
            }
            context.globalAlpha = 1;
        }

    };

    var init = function(){
        // UI events
        window.addEventListener('keydown', keyDown);
    };

    var centerLayer = function (layer, factor) {
        if (!layer)return;

        layer.element.init();
        layer.targetPoints = [];
        for (var i = 0; i < layer.element.points.length - 2; i+=2) {
            layer.targetPoints.push([layer.element.points[i], layer.element.points[i+1]]);
        }
        scaleLayer(layer, 1/factor);
    };

    var rotateLayer = function(layer, angle) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);

        var cp = centerPoint(layer);

        for(var p = 0; p < layer.targetPoints.length; p++) {
            var px = layer.targetPoints[p][0] - cp[0];
            var py = layer.targetPoints[p][1] - cp[1];

            layer.targetPoints[p][0] = (px * c) - (py * s) + cp[0];
            layer.targetPoints[p][1] = (px * s) + (py * c) + cp[1];
        }
    };

    var centerPoint = function (layer) {
        var cp = [0, 0];
        for(var p = 0; p < layer.targetPoints.length; p++) {
            cp[0] += layer.targetPoints[p][0];
            cp[1] += layer.targetPoints[p][1];
        }

        cp[0] /= layer.element.sides;
        cp[1] /= layer.element.sides;

        return cp;
    };

    var scaleLayer = function(layer, scale) {

        var cp = centerPoint(layer);

        for(var p = 0; p < layer.targetPoints.length; p++) {
            var px = layer.targetPoints[p][0] - cp[0];
            var py = layer.targetPoints[p][1] - cp[1];

            layer.targetPoints[p][0] = (px * scale) + cp[0];
            layer.targetPoints[p][1] = (py * scale) + cp[1];
        }
    };

    var keyDown = function(event) {
        if(!configActive){
            if(event.keyCode == 67) {// && event.shiftKey){
                setConfigEnabled(true);
                return;
            } else {
                return;
            }
        }

        var key = event.keyCode;

        var increment = event.shiftKey ? 10 : 1;
        var dirty = false;
        var delta = [0, 0];

        //console.log(key);
        switch(key) {

            case 67: // c (clipping)
                setConfigEnabled(false);
                return;
                break;

            case 37: // left arrow
                delta[0] -= increment;
                break;

            case 38: // up arrow
                delta[1] -= increment;
                break;

            case 39: // right arrow
                delta[0] += increment;
                break;

            case 40: // down arrow
                delta[1] += increment;
                break;

            case 82: // r key, rotate /sides degrees.
                if(selectedLayer) {
                    rotateLayer(selectedLayer, Math.PI / selectedLayer.element.sides / 2);
                    //rotateLayer(selectedLayer, 0.002);
                    updateClip();
                    draw();
                }
                break;

            case 49: //1, center zoom 1x
            case 50: //2, .. 0.5x
            case 51: //3, .. 0.33x
            case 52: //4..
            case 53: //5.
            case 54: //6
            case 55: //7
            case 56: //8
            case 57: //9
                if(selectedLayer) {
                    var c = String.fromCharCode(key);
                    var i = parseInt(c);
                    centerLayer(selectedLayer, i, event.shiftKey);
                    updateClip();
                    draw();
                }
                break;

            case 9: // tab key, next ...
                event.preventDefault();
                event.stopPropagation();
                if (!selectedLayer) {
                    selectedLayer = layers[0];
                }
                if (event.shiftKey) {
                    var ci = selectedLayer.selectedPoint;
                    if (!selectedPoint || ci == selectedLayer.targetPoints.length - 1) {
                        ci = 0;

                    } else {
                        ci++;
                    }
                    selectedPoint = selectedLayer.targetPoints[ci];
                    selectedLayer.selectedPoint = ci;
                    draw();

                } else {
                    selectedPoint = false;
                    var ci = layers.indexOf(selectedLayer);
                    if (ci == layers.length - 1) {
                        ci = 0;
                    } else {
                        ci++;
                    }
                    selectedLayer = layers[ci];
                    draw();
                }
                break;
        }

        // if a layer or point is selected, add the delta amounts (set above via arrow keys)
        if(selectedPoint) {
            selectedPoint[0] += delta[0];
            selectedPoint[1] += delta[1];
            dirty = true;
        } else if(selectedLayer) {
            if(event.altKey == true) {
                event.stopPropagation();
                event.preventDefault();
                rotateLayer(selectedLayer,  delta[0] * 0.01);
                scaleLayer(selectedLayer,  (delta[1] * -0.005) + 1.0);
            } else {
                for(var i = 0; i < selectedLayer.targetPoints.length; i++){
                    selectedLayer.targetPoints[i][0] += delta[0];
                    selectedLayer.targetPoints[i][1] += delta[1];
                }
            }
            dirty = true;
        }

        // update the transform and redraw if needed
        if(dirty){
            updateClip();
            draw();
            notifyChangeListener(selectedLayer);
        }
    };

    var mouseMove = function(event) {
        if(!configActive){
            return;
        }

        event.preventDefault();

        if (selectedLayer) {
            var p = convertPointFromPageToNode(selectedLayer.overlay, event.clientX, event.clientY);
            var m = convertPointFromPageToNode(selectedLayer.overlay, mousePosition[0], mousePosition[1]);
            mouseDelta[0] = p.x - m.x;
            mouseDelta[1] = p.y - m.y;

            mousePosition[0] = p.x;
            mousePosition[1] = p.y;
        }

        mousePosition[0] = event.clientX;
        mousePosition[1] = event.clientY;

        _mouseDelta[0] = event.clientX - _mousePosition[0];
        _mouseDelta[1] = event.clientY - _mousePosition[1];
        _mousePosition[0] = event.clientX;
        _mousePosition[1] = event.clientY;


        if(dragging) {

            var scale = event.shiftKey ? 0.1 : 1;

            if(selectedPoint) {
                selectedPoint[0] += mouseDelta[0] * scale;
                selectedPoint[1] += mouseDelta[1] * scale;

            } else if(selectedLayer) {

                // Alt-drag to rotate and scale
                if(event.altKey == true){
                    rotateLayer(selectedLayer,  mouseDelta[0] * (0.01 * scale));
                    scaleLayer(selectedLayer,  (mouseDelta[1] * (-0.005 * scale)) + 1.0);
                } else {
                    for(var i = 0; i < selectedLayer.targetPoints.length; i++){
                        selectedLayer.targetPoints[i][0] += mouseDelta[0] * scale;
                        selectedLayer.targetPoints[i][1] += mouseDelta[1] * scale;
                    }
                }
            } else if (event.ctrlKey) {
                //move all Layers
                for (var l = 0; l < layers.length; l++) {
                    var cl = layers[l];
                    for (var i = 0; i < cl.targetPoints.length; i++) {
                        cl.targetPoints[i][0] += _mouseDelta[0] * scale;
                        cl.targetPoints[i][1] += _mouseDelta[1] * scale;
                    }
                    notifyChangeListener(cl);
                }
            }

            updateClip();
            draw();
            notifyChangeListener(selectedLayer);

        } else {

            var mouseX = event.clientX;
            var mouseY = event.clientY;

            var previousState = (hoveringPoint != null);
            var previousLayer = (hoveringLayer != null);

            hoveringPoint = null;

            for(var i = 0; i < layers.length; i++) {
                var layer = layers[i];

                for(var p = 0; p < layer.targetPoints.length; p++) {
                    var point = layer.targetPoints[p];
                    var tp = convertPointFromNodeToPage(layer.overlay, point[0], point[1]);
                    if(distanceTo(tp.x, tp.y, mouseX, mouseY) < selectionRadius) {
                        layer.overlay.style.cursor = 'pointer';
                        hoveringPoint = point;
                        break;
                    }
                }

            }

            hoveringLayer = null;
            for(var i = 0; i < layers.length; i++) {
                if(pointInLayer([mouseX, mouseY], layers[i])){
                    hoveringLayer = layers[i];
                    break;
                }
            }

            if( (previousState != (hoveringPoint != null)) ||
                (previousLayer != (hoveringLayer != null))
            ) {
                draw();
            }
        }
    };

    var mouseUp = function(event) {
        if(!configActive){
            return;
        }
        event.preventDefault();

        dragging = false;
    };

    var mouseDown = function(event) {
        if (!configActive /*|| showScreenBounds*/) {
            return;
        }
        event.preventDefault();

        // hoveringPoint = null;

        if (hoveringPoint) {
            selectedLayer = hoveringLayer;
            selectedPoint = hoveringPoint;
            hoveringPoint = null;
            dragging = true;

        } else if(hoveringLayer) {
            selectedPoint = null;
            selectedLayer = hoveringLayer;
            dragging = true;

        } else if (event.ctrlKey) {
            dragging = true;

        } else {
            selectedPoint = null;
            selectedLayer = null;
        }

        // selectedPoint = null;

        // var mouseX = event.clientX;
        // var mouseY = event.clientY;
        //
        // for(var i = 0; i < layers.length; i++) {
        //     var layer = layers[i];
        //
        //     for(var p = 0; p < layer.targetPoints.length; p++){
        //         var point = layer.targetPoints[p];
        //         var tp = convertPointFromNodeToPage(layer.overlay, point[0], point[1]);
        //         if(distanceTo(tp.x, tp.y, mouseX, mouseY) < selectionRadius) {
        //             selectedLayer = layer;
        //             selectedPoint = point;
        //             selectedLayer.selectedPoint = p;
        //             dragging = true;
        //             break;
        //         }
        //     }
        // }
        draw();
        return false;
    };

    var removeLayer = function (element) {
        var removed = false;
        //clear();
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.element === element) {
                removed = layers.splice(i, 1);
                if (layer.overlay) {
                    document.body.removeChild(layer.overlay);
                }
            }
        }

        if (removed) {
            updateClip();
            if (getConfigEnabled()) {
                draw();
            }

            removed = removed[0];
        }
        return removed;
    };

    var addLayer = function(target) {

        var layer = {
            'visible' : true,
            'element' : target,
            'targetPoints' : []
        };

        for (var i = 0; i < target.points.length - 2; i+=2) {
            layer.targetPoints.push([target.points[i], target.points[i+1]]);
        }

        var found = false;
        for (var i = 0; i < layers.length; i++) {
            var l = layers[i];
            var e = l.element;
            if (e.id == target.id) { // found
                for (var i = 0; i < target.points.length - 2 && i/2 < l.targetPoints.length; i+=2) {
                    l.targetPoints[i/2][0] = target.points[i];
                    l.targetPoints[i/2][1] = target.points[i+1];
                }
                found = true;
                break;
            }
        }

        if (!found) {
            layers.push(layer);
        }

        if (getConfigEnabled()) {
            draw();
        }
    };

    var updateClip = function() {
        for (var l = 0; l < layers.length; l++) {
            var points = [];
            var tp = layers[l].targetPoints;
            for (var p = 0; p < tp.length; p++) {
                points.push(tp[p][0]);
                points.push(tp[p][1]);
            }
            points.push(tp[0][0]);
            points.push(tp[0][1]);
            layers[l].element.points = points;
            layers[l].element.update();
        }
    };

    var setConfigEnabled = function(enabled){
        configActive = enabled;

        if(!enabled) {

            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseup', mouseUp);
            window.removeEventListener('mousedown', mouseDown);

            document.body.style.background = '#000';
            for(var i = 0; i < layers.length; i++) {
                var l = layers[i].element.canvas;
                //l.style.outline = '';
            }

            selectedPoint = null;
            selectedLayer = null;
            clear();
        
        } else {

            window.addEventListener('mousemove', mouseMove);
            window.addEventListener('mouseup', mouseUp);
            window.addEventListener('mousedown', mouseDown);

            document.body.style.background = '#676767';
            for(var i = 0; i < layers.length; i++) {
                var l = layers[i].element.canvas;
                //l.style.outline = '1px solid blue';
            }

            draw();
        }
    };
    
    var getConfigEnabled = function () {
        return configActive;
    };

    init();

    // if the config was just an element or string, interpret it as a layer to add.

    for(var i = 0; i < arguments.length; i++){
        if((arguments[i] instanceof HTMLElement) || (typeof(arguments[i]) === 'string')) {
            addLayer(arguments[i]);
        }
    }

    return {
        'setConfigEnabled' : function(enabled){
            setConfigEnabled(enabled);
        },
        'getConfigEnabled' : function(){
            getConfigEnabled();
        },
        'addLayer' : function(mask){
            addLayer(mask);
        },
        'removeLayer' : function (element) {
            return removeLayer(element);
        },
        'refresh': function () {
            if (getConfigEnabled()) {
                draw();
            }
        }
    }
};