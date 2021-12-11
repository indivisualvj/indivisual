/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";

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
                this.centerPoint = new THREE.Vector3(res.x, -res.y, 0);
                shape.position().copy(this.centerPoint);
                params.centered = true;
            }

            if (!this.points || (this.isFirstShape(shape) && this.layer.shapeSpeed(shape).prc === 0)) {
                this.points = this.points || [];
                let numPoints = 12;//clamp(this.layer.settings.pattern_shapes, 12, 24);
                for (let i = 0; i < numPoints; i++)  {

                    if (this.points[i] && this.points[i]._mesh) {
                        this.layer._shapes.remove(this.points[i]._mesh);
                    }

                    let p = this.random2dPosition(0);//new THREE.Vector3(640, -600*i, 0);//
                    p.z = 0;
                    this.points[i] = p;

                    this.geometry = new THREE.CircleGeometry(this.layer.shapeSize(.125/2), 12);
                    this.material = new THREE.MeshPhongMaterial({emissive: 0xffffff});
                    let m = new THREE.Mesh(this.geometry, this.material);
                    this.layer._shapes.add(m);
                    m.position.copy(p);
                    p._mesh = m;
                }
            }
        }

        apply(shape, rhythm) {

            let params = this.params(shape);
            let a = shape.rotationZ();
            let x = Math.cos(a);
            let y = Math.sin(a);
            let v1 = new THREE.Vector3(x, y, 0);
            let e = new THREE.Euler(0, 0, RAD*90);
            v1.applyEuler(e);
            let v2 = v1.clone();
            e = new THREE.Euler(0, 0, RAD*180);
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

        closestPointOnLine (pointA, pointB, pointToCheck) {

            let l = new THREE.Line3(pointA, pointB, pointToCheck);
            let c = l.closestPointToPoint(pointToCheck, false, new THREE.Vector3());
            let dist = c.distanceTo(pointToCheck);

            return dist;
        }
    }

export {pivot};
