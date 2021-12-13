/**
 * @author indivisualvj / https://github.com/indivisualvj
 * Code mainly inspired by https://www.khanacademy.org/computer-programming/gravitation-simulation/967398954
 */

import {PatternPlugin} from "../PatternPlugin";


class gravitation extends PatternPlugin {
    static name = 'gravitation';

    particles = [];
    N = 10;

    before(shape) {
        if (this.isFirstShape(shape)) {
            this.computeForces();
            this.integrateAccelerations();
        }
    }

    /**
     *
     * @param shape
     */
    apply(shape) {
        let params = this.params(shape);
        let particle = params.particle;

        if (!particle) {
            particle = new Particle(shape, this.random2dPosition());
            this.particles.push(particle);
            params.particle = particle;
        }

        shape.position(particle.x, -particle.y, particle.z);

    }

    /**
     *
     */
    computeForces() {
        let gForce = 0.3;
        let p;
        let N = this.particles.length;

        for (let i = 0; i < N; i++) {
            p = this.particles[i];
            p.fx = 0;
            p.fy = 0;
        }
        for (let i = 0; i < N; i++) {
            let p1 = this.particles[i];
            for (let j = i + 1; j < N; j++) {
                let p2 = this.particles[j];

                // F = G * m1 * m2 / (r^2)
                let d = (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
                let F = gForce * p1.mass * p2.mass / d;

                // compute vector pointing from particle 1 -> 2
                let dx = p2.x - p1.x;
                let dy = p2.y - p1.y;

                // accumulate forces on each particle
                p1.fx += F * dx;
                p1.fy += F * dy;
                p2.fx -= F * dx;
                p2.fy -= F * dy;
            }
        }
    }

    /**
     *
     */
    integrateAccelerations() {
        let N = this.particles.length;
        // integrate acceleration down to velocity and positions
        for (let i = 0; i < N; i++) {
            let p = this.particles[i];
            let ax = p.fx / p.mass; // acceleration, according to F=ma
            let ay = p.fy / p.mass;
            p.vx += ax;
            p.vy += ay;
            p.x += p.vx;
            p.y += p.vy;
        }
    }
}

/**
 *
 */
class Particle {
    maxMass = 30;
    initVelocityMax = 1;

    injections = {
        particle: false
    };

    /**
     *
     * @param shape
     * @param pos
     */
    constructor(shape, pos) {
        this.mass = shape.size();
        this.x = pos.x;
        this.y = pos.y;
        this.z = pos.z;
        this.vx = randomFloat(-this.initVelocityMax, this.initVelocityMax, 2); // velocities
        this.vy = randomFloat(-this.initVelocityMax, this.initVelocityMax, 2);
        this.fx = 0; // forces we will accumulate
        this.fy = 0;
    }
}

export {gravitation};
