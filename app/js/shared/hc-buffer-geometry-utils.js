{
    HC.BufferGeometryUtils = class BufferGeometryUtils {

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
                let x = Math.round((vec3.x - box.min.x) / size.x);
                let y = Math.round((vec3.y - box.min.y) / size.y);
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
    }
}
