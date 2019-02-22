(function () {
    /**
     *
     * @param width
     * @param height
     * @constructor
     */
    HC.RoundedRect = function (width, height) {
        width *= .95;
        height *= .95;
        this.radius = new THREE.Vector2(width, height).length() * 0.1;
        this.hw = width / 2;
        this.hh = height / 2;
        this.corner = new THREE.Vector2(this.radius, this.radius).length();
    };

    HC.RoundedRect.prototype = {
        /**
         *
         * @returns {Shape}
         */
        create: function () {
            var shape = new THREE.Shape();
            var radius = this.radius;
            var ninety = Math.PI / 2;
            var hw = this.hw;
            var hh = -this.hh;

            // lowerleft
            shape.absarc(-hw + radius, hh + radius, radius, 180 * RAD, 270 * RAD);
            // shape.lineTo(hw-radius, hh);
            // lowerright
            shape.absarc(hw - radius, hh + radius, radius, -ninety, 0);
            // shape.lineTo(hw, -hh+radius);
            // upperright
            shape.absarc(hw - radius, -hh - radius, radius, 0 * RAD, 90 * RAD);
            // shape.lineTo(-hw+radius, -hh);
            // upperleft
            shape.absarc(-hw + radius, -hh - radius, radius, 90 * RAD, 180 * RAD);
            // shape.lineTo(-hw, hh-radius);

            var geo = new THREE.ShapeGeometry(shape);
            return geo;
        }
    }
})();

(function () {
    HC.DirectionalCircle = function (config) {

        this._sides = config.sides;
        this._radius = config.radius;
        this._direction = config.direction;
    };

    HC.DirectionalCircle.prototype = {
        create: function () {

            var sides = this._sides;
            var radius = this._radius;
            var dir = this._direction;
            var div = Math.PI * 0.5;
            var hseg = -div + (div / sides) * (dir - 1);

            var geo = new THREE.CircleGeometry(radius, sides, hseg);
            return geo;
        }
    };
})();

(function () {
    HC.DirectionalShape = function (config) {
        this._sides = config.sides;
        this._radius = config.radius;
        this._direction = config.direction;
    };

    HC.DirectionalShape.prototype = {
        create: function () {
            var shape = new THREE.Shape();
            var radius = this._radius;
            var dir = this._direction;
            var sides = this._sides;
            var div = Math.PI * 0.5;
            var hseg = (div / sides) * (dir - 1);
            var step = Math.PI * 2 / sides;

            var x = Math.sin(hseg) * radius;
            var y = Math.cos(hseg) * radius;
            shape.moveTo(x, -y);

            for (var i = 0; i < sides; i++) {
                x = Math.sin(step * i + hseg) * radius;
                var y = Math.cos(step * i + hseg) * radius;
                shape.lineTo(x, -y);
            }
            var geometry = new THREE.ShapeGeometry(shape);
            return geometry;
        }
    }
})();

/**
 *
 */
(function () {
    HC.Rect = function (config) {

        this._hw = config.width / 2;
        this._hh = config.height / 2;
    };

    HC.Rect.prototype = {
        create: function () {

            var shape = new THREE.Shape();
            shape.moveTo(-this._hw, this._hh);
            shape.lineTo(this._hw, this._hh);
            shape.lineTo(this._hw, -this._hh);
            shape.lineTo(-this._hw, -this._hh);
            shape.lineTo(-this._hw, this._hh);

            var geometry = new THREE.ShapeGeometry(shape);

            return geometry;
        }
    };
})();

/**
 *
 */
(function () {
    HC.RightTriangle = function (config) {

        this._hw = config.width / 2;
        this._hh = config.height / 2;
    };

    HC.RightTriangle.prototype = {
        create: function () {

            var shape = new THREE.Shape();
            shape.moveTo(-this._hw, this._hh);
            shape.lineTo(this._hw, this._hh);
            shape.lineTo(this._hw, -this._hh);
            shape.lineTo(-this._hw, this._hh);

            var geometry = new THREE.ShapeGeometry(shape);

            return geometry;
        }
    };
})();

/**
 *
 */
(function () {
    HC.CustomGeometry = function () {
    };
    HC.CustomGeometry.prototype = {
        fromString: function (vtcs, multiplier) {

            vtcs = vtcs
                ? '[' + vtcs + ']'
                : '[[' + (-1) + ',' + (1) + ',0],[' + (1) + ',' + (1) + ',0],[' + (1) + ',' + (-1) + ',0]]';
            vtcs = JSON.parse(vtcs);

            var geometry = new THREE.Geometry();

            for (var i = 0; i < vtcs.length; i++) {
                var vtc = vtcs[i];
                var vec = new THREE.Vector3(round(multiplier * vtc[0], 0), round(multiplier * vtc[1], 0), 0);
                geometry.vertices.push(vec);
                if (i % 3 == 0) geometry.faces.push(new THREE.Face3(i + 0, i + 1, i + 2));
            }

            geometry.computeFaceNormals();
            var n = geometry.faces;
            for (var i = 0; i < n.length; i++) {
                var face = n[i];
                if (face.normal.z < 0) { // check for twisted faces and twist
                    var tmp = face.a;
                    face.a = face.c;
                    face.c = tmp;
                }
            }

            return geometry;
        }
    };
})();

/**
 *
 * @param geometry
 */
function assignUVs(geometry) {
    // var layer = this.layer;
    geometry.computeBoundingBox();
    geometry._uvsAssigned = true;

    // var uvx = layer.settings.material_uvx;
    // var uvy = layer.settings.material_uvy;
    // var ofx = layer.settings.material_uvofx;
    // var ofy = layer.settings.material_uvofy;
    var max = geometry.boundingBox.max;
    var min = geometry.boundingBox.min;

    // max.x *= uvx;
    // max.y *= uvy;
    // min.x *= uvx;
    // min.y *= uvy;

    ofx = 0;//max.x / 2 - max.x * ofx;
    ofy = 0;//max.y / 2 - max.y * ofy;

    var offset = new THREE.Vector2(ofx - min.x, ofy - min.y);
    var range = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (i = 0; i < geometry.faces.length; i++) {

        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
            new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
            new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
        ]);

    }

    geometry.uvsNeedUpdate = true;
}