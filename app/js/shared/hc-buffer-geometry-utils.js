{
    HC.BufferGeometryUtils = class BufferGeometryUtils {

        /**
         *
         * @param geometry
         */
        static front2back(geometry) {
            geometry.computeBoundingBox();

            let box = geometry.boundingBox;
            let size = new THREE.Vector3();
            box.getSize(size);

            let attPos = geometry.attributes.position;
            let attUv = geometry.attributes.uv;
            let uvs = [];
            let vec3 = new THREE.Vector3(); // temp vector
            for (let i = 0; i < attPos.count; i++) {
                vec3.fromBufferAttribute(attPos, i);
                let x = ((vec3.x - box.min.x) / size.x);
                let y = ((vec3.y - box.min.y) / size.y);
                if (attUv) {
                    attUv.setXYZ(i,
                        x,
                        y,
                    );
                } else {
                    uvs.push(
                        x,
                        y,
                    );
                }
            }

            if (!attUv) {
                geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
            }

            geometry.attributes.uv.needsUpdate = true;
        }

        /**
         *
         * @param geometry
         * @returns {*}
         */
        static sortVertices(geometry) {
            geometry.computeVertexNormals();

            let p = geometry.attributes.position;
            let n = geometry.attributes.normal;
            let v1 = new THREE.Vector3();
            let f = new THREE.Vector3();

            for (let i = 0; i < n.count; i++) {
                v1.fromBufferAttribute(p, i);
                f.fromBufferAttribute(n, i);
                if (f.z < 0) {
                    let v2 = new THREE.Vector3();
                    v2.fromBufferAttribute(p, i+1);
                    let v3 = new THREE.Vector3();
                    v3.fromBufferAttribute(p, i+2);

                    p.setXYZ(i  , v3.x, v3.y, v3.z);
                    p.setXYZ(i+1, v2.x, v2.y, v2.z);
                    p.setXYZ(i+2, v1.x, v1.y, v1.z);
                    n.setXYZ(i  , 0, 0, 1);
                    n.setXYZ(i+1, 0, 0, 1);
                    n.setXYZ(i+2, 0, 0, 1);
                    i+=2;

                }
            }

            geometry.attributes.position.needsUpdate = true;

            return geometry;
        }

        /**
         *
         * @param geometry
         * @param tolerance
         * @returns {*}
         */
        static mergeVertices(geometry, tolerance) {
            if (geometry.attributes.position) {
                return THREE.BufferGeometryUtils.mergeVertices(geometry, tolerance);
            }

            return geometry;
        }
    }
}
