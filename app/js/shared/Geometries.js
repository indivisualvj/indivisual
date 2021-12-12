/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {GeometryUtils} from "./GeometryUtils";
import {BufferGeometry, CircleGeometry, RingGeometry, Shape, ShapeGeometry, Vector2, Vector3} from "three";

class RoundedRect {

    /**
     *
     * @param edgeSize
     * @param cornerRadius
     * @param curveSegments
     */
    constructor(edgeSize, cornerRadius, curveSegments) {
        edgeSize *= .95;
        this.radius = new Vector2(edgeSize, edgeSize).length() * cornerRadius * 0.0025;
        this.hw = edgeSize / 2;
        this.hh = edgeSize / 2;
        this.radius = Math.min(this.hw, this.radius);
        // this.corner = new Vector2(this.radius, this.radius).length();
        this.curveSegments = curveSegments;
    }

    /**
     *
     * @returns {ShapeGeometry}
     */
    create() {
        let shape = new Shape();
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

        return new ShapeGeometry(shape, this.curveSegments);
    }
}

class DirectionalCircle {

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
     * @returns {CircleGeometry}
     */
    create() {

        let edges = this._edges;
        let radius = this._radius;
        let dir = this._direction;
        let div = Math.PI * 0.5;
        let hseg = -div + (div / edges) * dir;

        return new CircleGeometry(radius, edges, hseg);
    }
}

class DirectionalRing {

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
     * @returns {RingGeometry}
     */
    create() {

        let edges = this.edges;
        let dir = this.direction;
        let div = Math.PI * 0.5;
        let hseg = -div + (div / edges) * dir;

        return new RingGeometry(this.innerRadius, this.outerRadius, edges, 1, hseg);
    }
}

class DirectionalShape {

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
     * @returns {ShapeGeometry}
     */
    create() {
        let shape = new Shape();
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
        return new ShapeGeometry(shape);
    }
}

class Rect {

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
     * @returns {ShapeGeometry}
     */
    create() {

        let shape = new Shape();
        shape.moveTo(-this._hw, this._hh);
        shape.lineTo(this._hw, this._hh);
        shape.lineTo(this._hw, -this._hh);
        shape.lineTo(-this._hw, -this._hh);
        shape.lineTo(-this._hw, this._hh);

        return new ShapeGeometry(shape);
    }
}

class RightTriangle {

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
     * @returns {ShapeGeometry}
     */
    create() {

        let shape = new Shape();
        shape.moveTo(-this._hw, this._hh);
        shape.lineTo(this._hw, this._hh);
        shape.lineTo(this._hw, -this._hh);
        shape.lineTo(-this._hw, this._hh);

        return new ShapeGeometry(shape);
    }
}

class CustomGeometry {

    /**
     *
     */
    constructor() {
    }

    /**
     *
     * @param vtcs
     * @param multiplier
     * @returns {BufferGeometry}
     */
    fromString(vtcs, multiplier) {

        vtcs = vtcs
            ? '[' + vtcs + ']'
            : '[[' + (-1) + ',' + (-1) + ',1],[' + (1) + ',' + (-1) + ',1],[' + (-1) + ',' + (1) + ',1]]';
        vtcs = JSON.parse(vtcs);

        let points = [];
        for (let i = 0; i < vtcs.length; i++) {
            let vtc = vtcs[i];
            let vec = new Vector3(round(multiplier * vtc[0], 0), round(multiplier * vtc[1], 0), 0);
            points.push(vec);
        }
        let geometry = new BufferGeometry().setFromPoints(points);
        GeometryUtils.sortVertices(geometry);

        return geometry;
    }
}

export {RightTriangle, DirectionalCircle, Rect, RoundedRect, DirectionalRing, DirectionalShape, CustomGeometry};
