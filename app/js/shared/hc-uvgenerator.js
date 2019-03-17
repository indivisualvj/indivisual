
{
    HC.UVGenerator = class UVGenerator {

        /**
         * source: https://gist.github.com/hacksalot/30e071961b6dabf3c1be
         * @param geometry
         */
        static front2back(geometry) {
            geometry.computeBoundingBox();

            var max = geometry.boundingBox.max;
            var min = geometry.boundingBox.min;

            var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
            var range = new THREE.Vector2(max.x - min.x, max.y - min.y);

            geometry.faceVertexUvs[0] = [];
            var faces = geometry.faces;

            for (var i = 0; i < geometry.faces.length; i++) {

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
            geometry._uvsAssigned = true;
        }
    }
}
