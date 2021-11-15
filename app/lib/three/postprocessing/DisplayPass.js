/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

THREE.DisplayPass = function(textureID ) {

    this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

    var shader = THREE.DisplayShader;
    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.material = new THREE.ShaderMaterial( {

        defines: shader.defines || {},
        uniforms: this.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader

    } );

    this.material.transparent = false;

    this.renderToScreen = false;

    this.enabled = true;
    this.needsSwap = true;
    this.clear = true;

    this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    this.scene = new THREE.Scene();
    this.scene.autoUpdate = false;

    this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
    this.quad.matrixAutoUpdate = false;
    this.quad.updateMatrix();
    this.scene.add( this.quad );

};

THREE.DisplayPass.prototype = {

    render: function( renderer, writeBuffer, readBuffer, delta ) {

        if ( this.uniforms[ this.textureID ] ) {

            this.uniforms[ this.textureID ].value = readBuffer.texture;

        }

        this.quad.material = this.material;

        if ( this.renderToScreen ) {

            renderer.render( this.scene, this.camera );

        } else {

            renderer.render( this.scene, this.camera, writeBuffer, this.clear );

        }

    }

};

THREE.DisplayShader = {

    uniforms: {
        'tBase': { type: 't', value: null },
        'tAdd': { type: 't', value: null },
        'alphaB': {type: 'f', value: 1.0},
        'transparency': {type: 'f', value: 1.0},
        'merge': {type: 'i', value: 0},
        'flipXb': {type: 'i', value: 0},
        'flipYb': {type: 'i', value: 0},
        'operation': {type: 'i', value: 0}

    },

    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,

    fragmentShader: `
        uniform sampler2D tAdd;
        uniform sampler2D tBase;
        uniform int operation;
        uniform int flipXb;
        uniform int flipYb;
        uniform float alphaB;
        uniform float transparency;
        uniform int merge;
` + HC.BlendOperator.display.shader + `
        varying vec2 vUv;
        void main() {
           vec2 uvB = vec2(vUv);
           if (flipXb == 0) {
              uvB.x = 1.0 - uvB.x;
           }
           if (flipYb == 0) {
              uvB.y = 1.0 - uvB.y;
           }

           vec4 texB = texture2D(tBase, uvB);
           texB.a *= alphaB;
           if (transparency < 1.0) {
              float f = 1.0-transparency;
              vec4 b = vec4(0.0, 0.0, 0.0, f);
              texB = operator(texB, b, 0);
           }
           vec4 col = texB;

           if (merge == 1) {
              vec4 texA = texture2D(tAdd, vUv);
              col = operator(texB, texA, operation);
           }
           gl_FragColor = col;
        }
    `

    

};
