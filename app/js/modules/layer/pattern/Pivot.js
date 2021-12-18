/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";
import {CircleGeometry, Euler, Line3, Mesh, MeshPhongMaterial, Vector3} from "three";
import {Shape} from "../../../animation/Shape";

class pivot extends PatternPlugin {
    static name = 'random pivot (shape speed)';

    points = false;
    centerPoint = false;
    injections = {
        centered: false,
        currentPoint: false,
        lastPoint: false,
        position: false
    };

    before(shape) {
        let params = this.params(shape);
        if (!params.centered) {
            let res = this.layer.resolution('half');
            this.centerPoint = new Vector3(res.x, -res.y, 0);
            shape.position().copy(this.centerPoint);
            params.centered = true;
        }

        if (!this.points || (this.isFirstShape(shape) && this.layer.shapeSpeed(shape).prc === 0)) {
            this.points = this.points || [];
            let numPoints = 12;//clamp(this.layer.settings.pattern_shapes, 12, 24);
            for (let i = 0; i < numPoints; i++) {

                if (this.points[i] && this.points[i]._mesh) {
                    this.layer._shapes.remove(this.points[i]._mesh);
                }

                let position = this.random2dPosition();
                position.z = 0;
                this.points[i] = position;

                this.geometry = new CircleGeometry(this.layer.shapeSize(.125 / 2), 12);
                this.material = new MeshPhongMaterial({emissive: 0xffffff});
                let pointMesh = new Mesh(this.geometry, this.material);
                this.layer._shapes.add(pointMesh);
                position.add(this.centerPoint);
                pointMesh.position.copy(position);

                position._mesh = pointMesh;
            }
        }
    }

    apply(shape, rhythm) {

        let params = this.params(shape);
        let a = shape.rotationZ();
        let x = Math.cos(a);
        let y = Math.sin(a);
        let v1 = new Vector3(x, y, 0);
        let e = new Euler(0, 0, RAD * 90);
        v1.applyEuler(e);
        let v2 = v1.clone();
        e = new Euler(0, 0, RAD * 180);
        v2.applyEuler(e);

        v1.multiplyScalar(1000);
        v2.multiplyScalar(1000);

        v1.add(shape.position());
        v2.add(shape.position());

        let closestPoint = false;
        let closest = 10000;

        for (let i = 0; i < this.points.length; i++) {
            let p = this.points[i];

            if (p !== params.currentPoint && p !== params.lastPoint) {
                let n = Math.min(closest, this.closestPointOnLine(v1, v2, p));
                if (n < closest) {
                    closest = n;
                    closestPoint = p;
                }
            }
        }
        if (closest < 5 && closestPoint) {
            shape.position().copy(closestPoint);
            params.lastPoint = params.currentPoint;
            params.currentPoint = closestPoint;
        }

    }

    closestPointOnLine(pointA, pointB, pointToCheck) {

        let l = new Line3(pointA, pointB, pointToCheck);
        let c = l.closestPointToPoint(pointToCheck, false, new Vector3());

        return c.distanceTo(pointToCheck);
    }
}

export {pivot};
