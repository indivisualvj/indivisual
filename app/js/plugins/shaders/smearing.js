{
    HC.plugins.shaders.smearing = class Plugin extends HC.ShaderPlugin {
        static index = 185;

        create() {
            if (!this.pass) {
                this.pass = new THREE.SmearingPass();
            }
            this.pass.setSize(this.layer.resolution().x, this.layer.resolution().y);

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            opacity: {
                value: 0.80,
                _type: [0, 1, 0.01],
                audio: false,
                oscillate: "off"
            }
        }
    }
}

/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

THREE.SmearingPass = function () {

    let shader = THREE.SmearingShader;
    this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    let parameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false
    };

    this.target1 = new THREE.WebGLRenderTarget( 1280, 720, parameters );
    this.target2 = this.target1.clone();
    this.targetSwitch = false;

    this.material = new THREE.ShaderMaterial({
        defines: shader.defines || {},
        uniforms: this.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
    });

    this.material.transparent = false;

    this.renderToScreen = false;
    this.enabled = true;
    this.needsSwap = true;
    this.clear = false;

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new THREE.Scene();
    this.scene.autoUpdate = false;

    this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
    this.quad.matrixAutoUpdate = false;
    this.quad.updateMatrix();
    this.scene.add(this.quad);

};

THREE.SmearingPass.prototype = {

    render: function (renderer, writeBuffer, readBuffer) {

        this.uniforms.tCurrent.value = readBuffer.texture;

        this.uniforms.tLast.value = this.targetSwitch ? this.target2.texture : this.target1.texture;

        this.quad.material = this.material;

        renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
        if (this.clear) {
            renderer.clear();
        }
        renderer.render(this.scene, this.camera);

        renderer.setRenderTarget(this.targetSwitch ? this.target1 : this.target2);
        renderer.render(this.scene, this.camera);

        this.targetSwitch = !this.targetSwitch;
    },

    setSize: function ( width, height ) {
        this.target1.setSize(width, height);
        this.target2.setSize(width, height);
    }

};

THREE.SmearingShader = {

    uniforms: {
        "tLast": {type: "t", value: null},
        "tCurrent": {type: "t", value: null},
        "opacity": {type: "f", value: .8}
    },

    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,

    fragmentShader: `

        uniform float opacity;
        uniform sampler2D tCurrent;
        uniform sampler2D tLast;
        varying vec2 vUv;

        void main() {
            vec4 nu = texture2D( tCurrent, vUv );
            vec4 old = texture2D( tLast, vUv );
            float sum = nu.r + nu.g + nu.b;
            if (sum > 0.0) {
                // nu /= 2.0;
                gl_FragColor = nu;
            } else {
                gl_FragColor = old * opacity;
            }
        }
    `
}