/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

THREE.DisplayPass = function( shader, textureID ) {

    this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

    shader = shader || THREE.DisplayShader;
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
