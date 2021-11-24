
{
    HC.UVGenerator = class UVGenerator {

        static default(geometry) {
            geometry.computeBoundingBox();

            let box = geometry.boundingBox;
            let size = new THREE.Vector3();
            box.getSize(size);

            let attPos = geometry.attributes.position;
            let attUv = geometry.attributes.uv;
            let vec3 = new THREE.Vector3(); // temp vector
            for (let i = 0; i < attPos.count; i++){
                vec3.fromBufferAttribute(attPos, i);
                attUv.setXY(i,
                    (vec3.x - box.min.x) / size.x,
                    (vec3.y - box.min.y) / size.y
                );
            }
        }

        /**
         * source: https://gist.github.com/hacksalot/30e071961b6dabf3c1be
         * @param geometry
         */
        static front2back(geometry) {
            geometry.computeBoundingBox();

            let box = geometry.boundingBox;
            let size = new THREE.Vector3();
            box.getSize(size);

            let attPos = geometry.attributes.position;
            let attUv = geometry.attributes.uv;
            let vec3 = new THREE.Vector3();
            let max = geometry.boundingBox.max;
            let min = geometry.boundingBox.min;

            let range = new THREE.Vector2(max.x - min.x, max.y - min.y);
            for (let i = 0; i < attPos.count; i++){
                vec3.fromBufferAttribute(attPos, i);
                attUv.setXYZ(i,
                    (vec3.x - box.min.x) / size.x,
                    (vec3.y - box.min.y) / size.y,
                    (vec3.z - box.min.z) / range.y
                );
            }
        }
    }
}
