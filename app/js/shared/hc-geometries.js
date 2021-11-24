{

    HC.RoundedRect = class RoundedRect {

        /**
         *
         * @param edgeSize
         * @param cornerRadius
         * @param curveSegments
         */
        constructor(edgeSize, cornerRadius, curveSegments) {
            edgeSize *= .95;
            this.radius = new THREE.Vector2(edgeSize, edgeSize).length() * cornerRadius * 0.0025;
            this.hw = edgeSize / 2;
            this.hh = edgeSize / 2;
            this.radius = Math.min(this.hw, this.radius);
            // this.corner = new THREE.Vector2(this.radius, this.radius).length();
            this.curveSegments = curveSegments;
        }

        /**
         *
         * @returns {THREE.ShapeGeometry}
         */
        create() {
            let shape = new THREE.Shape();
            let radius = this.radius;
            let ninety = Math.PI / 2;
            let hw = this.hw;
            let hh = -this.hh;

            // lowerleft
            shape.absarc(-hw + radius, hh + radius, radius, 180 * RAD, 270 * RAD);
            // shape.lineTo(hw-radius, hh);
            // lowerright
            shape.absarc(hw - radius, hh + radius, radius, -ninety, 0);
            // shape.lineTo(hw, -hh+radius);
            // upperright
            shape.absarc(hw - radius, -hh - radius, radius, RAD, 90 * RAD);
            // shape.lineTo(-hw+radius, -hh);
            // upperleft
            shape.absarc(-hw + radius, -hh - radius, radius, 90 * RAD, 180 * RAD);
            // shape.lineTo(-hw, hh-radius);

            return new THREE.ShapeGeometry(shape, this.curveSegments);
        }
    }
}

{

    HC.DirectionalCircle = class DirectionalCircle {

        /**
         *
         * @param config
         */
        constructor(config) {
            this._edges = config.edges;
            this._radius = config.radius;
            this._direction = config.direction;
        }

        /**
         *
         * @returns {THREE.CircleGeometry}
         */
        create() {

            let edges = this._edges;
            let radius = this._radius;
            let dir = this._direction;
            let div = Math.PI * 0.5;
            let hseg = -div + (div / edges) * dir;

            return new THREE.CircleGeometry(radius, edges, hseg);
        }
    }
}


{

    HC.DirectionalRing = class DirectionalRing {

        /**
         *
         * @param config
         */
        constructor(config) {

            this.edges = config.edges;
            this.innerRadius = config.innerRadius;
            this.outerRadius = config.outerRadius;
            this.direction = config.direction;
        }

        /**
         *
         * @returns {THREE.RingGeometry}
         */
        create() {

            let edges = this.edges;
            let dir = this.direction;
            let div = Math.PI * 0.5;
            let hseg = -div + (div / edges) * dir;

            let geo = new THREE.RingGeometry(this.innerRadius, this.outerRadius, edges, 1, hseg);
            return geo;
        }
    }
}


{

    HC.DirectionalShape = class DirectionalShape {

        /**
         *
         * @param config
         */
        constructor(config) {
            this._edges = config.edges;
            this._radius = config.radius;
            this._direction = config.direction;
        }

        /**
         *
         * @returns {THREE.ShapeGeometry}
         */
        create() {
            let shape = new THREE.Shape();
            let radius = this._radius;
            let dir = this._direction;
            let edges = this._edges;
            let div = Math.PI * 0.5;
            let hseg = (div / edges) * dir;
            let step = Math.PI * 2 / edges;

            let x = Math.sin(hseg) * radius;
            let y = Math.cos(hseg) * radius;
            shape.moveTo(x, -y);

            for (let i = 0; i < edges; i++) {
                x = Math.sin(step * i + hseg) * radius;
                let y = Math.cos(step * i + hseg) * radius;
                shape.lineTo(x, -y);
            }
            let geometry = new THREE.ShapeGeometry(shape);
            return geometry;
        }
    }
}

{

    HC.Rect = class Rect {

        /**
         *
         * @param config
         */
        constructor(config) {
            this._hw = config.width / 2;
            this._hh = config.height / 2;
        }

        /**
         *
         * @returns {THREE.ShapeGeometry}
         */
        create() {

            let shape = new THREE.Shape();
            shape.moveTo(-this._hw, this._hh);
            shape.lineTo(this._hw, this._hh);
            shape.lineTo(this._hw, -this._hh);
            shape.lineTo(-this._hw, -this._hh);
            shape.lineTo(-this._hw, this._hh);

            let geometry = new THREE.ShapeGeometry(shape);

            return geometry;
        }
    }
}

{

    HC.RightTriangle = class RightTriangle {

        /**
         *
         * @param config
         */
        constructor(config) {
            this._hw = config.width / 2;
            this._hh = config.height / 2;
        }

        /**
         *
         * @returns {THREE.ShapeGeometry}
         */
        create() {

            let shape = new THREE.Shape();
            shape.moveTo(-this._hw, this._hh);
            shape.lineTo(this._hw, this._hh);
            shape.lineTo(this._hw, -this._hh);
            shape.lineTo(-this._hw, this._hh);

            let geometry = new THREE.ShapeGeometry(shape);

            return geometry;
        }
    }
}

{

    HC.CustomGeometry = class CustomGeometry {

        /**
         *
         */
        constructor() {
        }

        /**
         *
         * @param vtcs
         * @param multiplier
         * @returns {THREE.BufferGeometry}
         */
        fromString(vtcs, multiplier) {

            vtcs = vtcs
                ? '[' + vtcs + ']'
                : '[[' + (-1) + ',' + (-1) + ',1],[' + (1) + ',' + (-1) + ',1],[' + (-1) + ',' + (1) + ',1]]';
            vtcs = JSON.parse(vtcs);

            let points = [];
            let normals = [];
            for (let i = 0; i < vtcs.length; i++) {
                let vtc = vtcs[i];
                let vec = new THREE.Vector3(round(multiplier * vtc[0], 0), round(multiplier * vtc[1], 0), 0);
                points.push(vec);
                if (i % 3 === 0) normals.push([i, i + 1, i + 2]);
            }
            let geometry = new THREE.BufferGeometry().setFromPoints(points);
            geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
            // geometry.computeVertexNormals();
            geometry.attributes.normal.needsUpdate = true;

            return geometry;
        }
    }
}