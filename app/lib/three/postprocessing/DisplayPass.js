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

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join( "\n" ),

    fragmentShader: [

        "uniform sampler2D tAdd;",
        "uniform sampler2D tBase;",
        "uniform int operation;",
        "uniform int flipXb;",
        "uniform int flipYb;",
        "uniform float alphaB;",
        "uniform float transparency;",
        "uniform int merge;",

        "varying vec2 vUv;",

        "vec4 colorBurn( vec4 s, vec4 d ) {",
        "   if (s.a > 0.0 && d.a > 0.0) {",
        "      return 1.0 - (1.0 - d) / s;",

        "   } else if (s.a > 0.0) {",
        "      return s;",

        "   } else {",
        "      return d;",
        "   }",
        "}",

        "vec4 linearBurn( vec4 s, vec4 d ) {",
        "   return s + d - 1.0;",
        "}",

        "vec4 colorDodge( vec4 s, vec4 d ) {",
        "   if (s.a > 0.0 && d.a > 0.0) {",
        "      return d / (1.0 - s);",

        "   } else if (s.a > 0.0) {",
        "      return s;",

        "   } else {",
        "      return d;",
        "   }",

        "}",

        "float fhardLight( float s, float d ) {",
        "   return (s < 0.5) ? 2.0 * s * d : 1.0 - 2.0 * (1.0 - s) * (1.0 - d);",
        "}",

        "vec4 hardLight( vec4 s, vec4 d ) {",
        "   if (s.a > 0.0 && d.a > 0.0) {",
        "      vec4 c;",
        "      c.x = fhardLight(s.x,d.x);",
        "      c.y = fhardLight(s.y,d.y);",
        "      c.z = fhardLight(s.z,d.z);",
        "      c.a = max(s.a, d.a);",
        "      return c;",

        "   } else if (s.a > 0.0) {",
        "      return s;",

        "   } else {",
        "      return d;",
        "   }",
        "}",

        "float fvividLight( float s, float d ) {",
        "   return (s < 0.5) ? 1.0 - (1.0 - d) / (2.0 * s) : d / (2.0 * (1.0 - s));",
        "}",

        "vec4 vividLight( vec4 s, vec4 d ) {",
        "   vec4 c;",
        "   c.x = fvividLight(s.x,d.x);",
        "   c.y = fvividLight(s.y,d.y);",
        "   c.z = fvividLight(s.z,d.z);",

        "   return c;",
        "}",

        "float fpinLight( float s, float d ) {",
        "   return (2.0 * s - 1.0 > d) ? 2.0 * s - 1.0 : (s < 0.5 * d) ? 2.0 * s : d;",
        "}",

        "vec4 pinLight( vec4 s, vec4 d ) {",
        "   vec4 c;",
        "   c.x = fpinLight(s.x,d.x);",
        "   c.y = fpinLight(s.y,d.y);",
        "   c.z = fpinLight(s.z,d.z);",

        "   return c;",
        "}",

        "vec4 hardMix( vec4 s, vec4 d ) {",
        "   return floor(s + d);",
        "}",

        "vec4 subtract( vec4 s, vec4 d ) {",
        "   return s - d;",
        "}",

        "vec4 xor( vec4 s, vec4 d ) {",
        "   float Fa = 1.0 - d.a; float Fb = 1.0 - s.a;",
        "   vec3 co = s.a * s.rgb * Fa + d.a * d.rgb * Fb;",
        "   float ao = s.a * Fa + d.a * Fb;",
        "   return vec4(co, ao);",
        //"   if (s.a > 0.0 && d.a > 0.0) {",
        //"      return vec4(0.0);",
        //
        //"   } else if (s.a > 0.0) {",
        //"      return s;",
        //
        //"   } else {",
        //"      return d;",
        //"   }",
        "}",

        "vec4 sourceOver ( vec4 s, vec4 d ) {",
        "   float Fb = 1.0-s.a;",
        "   vec3 co = s.a * s.rgb + d.a * d.rgb * Fb;",
        "   float ao = s.a + d.a * Fb;",
        "   return vec4(co, ao);",

        //"   return (d * (1.0 - s.a))+(s * s.a);",
        "}",
        "vec4 destinationOver ( vec4 s, vec4 d ) {",
        "   float Fa = 1.0 - d.a;",
        "   vec3 co = s.a * s.rgb * Fa + d.a * d.rgb;",
        "   float ao = s.a * Fa + d.a;",
        "   return vec4(co, ao);",
        //"   return (s * (1.0 - d.a))+(d * d.a);",
        "}",

        "vec4 sourceIn( vec4 s, vec4 d ) {",
        "   vec3 co = s.a * s.rgb * d.a;",
        "   float ao = s.a * d.a;",
        "   return vec4(co, ao);",
        //"   if (s.a > 0.0 && d.a > 0.0) {",
        //"       s.a *= d.a;",
        //"       return s;",
        //"   }",
        //"   return vec4(0.0);",
        "}",
        "vec4 destinationIn( vec4 s, vec4 d ) {",
        "   vec3 co = d.a * d.rgb * s.a;",
        "   float ao = d.a * s.a;",
        "   return vec4(co, ao);",
        //"   if (d.a > 0.0 && s.a > 0.0) {",
        //"       d.a *= s.a;",
        //"       return d;",
        //"   }",
        //"   return vec4(0.0);",
        "}",

        "vec4 sourceOut( vec4 s, vec4 d ) {",
        "   float Fa = 1.0 - d.a;",
        "   vec3 co = s.a * s.rgb * Fa;",
        "   float ao = s.a * Fa;",
        "   return vec4(co, ao);",
        //"   s.a -= d.a;",
        //"   return s;",
        "}",
        "vec4 destinationOut( vec4 s, vec4 d ) {",
        //"   d.a -= s.a;",
        //"   return d;",
        "   float Fb = 1.0 - s.a;",
        "   vec3 co = d.a * d.rgb * Fb;",
        "   float ao = d.a * Fb;",
        "   return vec4(co, ao);",
        "}",

        "vec4 sourceAtop( vec4 s, vec4 d ) {",
        "   float Fb = 1.0 - s.a;",
        "   vec3 co = s.a * s.rgb * d.a + d.a * d.rgb * Fb;",
        "   float ao = s.a * d.a + d.a * Fb;",
        "   return vec4(co, ao);",
        //"   if (s.a > 0.0) {",
        //"      s.a = d.a;",
        //"      return s;",
        //"   }",
        //"   return d;",
        "}",
        "vec4 destinationAtop( vec4 s, vec4 d ) {",
        "   float Fa = 1.0 - d.a;",
        "   vec3 co = s.a * s.rgb * Fa + d.a * d.rgb * s.a;",
        "   float ao = s.a * Fa + d.a * s.a;",
        "   return vec4(co, ao);",
        //"   if (d.a > 0.0) {",
        //"      d.a = s.a;",
        //"      return d;",
        //"   }",
        //"   return s;",
        "}",

        "vec4 lighter( vec4 s, vec4 d ) {",
        "   vec3 co = s.a * s.rgb + d.a * d.rgb;",
        "   float ao = s.a + d.a;",
        "   return vec4(co, ao);",
        "}",

        "vec4 multiply( vec4 s, vec4 d ) {",
        //"   if (s.a > 0.0 && d.a > 0.0) {",
        "      return sourceOver(s,d) * destinationOver(s,d);",

        //"   } else if (s.a > 0.0) {",
        //"      return s;",

        //"   } else {",
        //"      return d;",
        //"   }",
        "}",

        "vec4 difference( vec4 s, vec4 d ) {",
        "   return vec4(abs(d.rgb - s.rgb), s.a*d.a);",
        "}",

        "vec4 toRGB(vec4 bg, vec4 s) {",
        "   vec4 r = vec4(0.0);",
        "   r.r = ((1.0-s.a) * bg.r) + (s.a * s.r);",
        "   r.g = ((1.0-s.a) * bg.g) + (s.a * s.g);",
        "   r.b = ((1.0-s.a) * bg.b) + (s.a * s.b);",
        "   r.a = bg.a;",
        "   return r;",
        "}",

        "vec4 operator(vec4 a, vec4 b, int operator) {",

        "   if (operator == 0) {",
        "      return sourceOver(a, b);",

        "   } else if (operator == 1) {",
        "      return sourceAtop(a, b);",

        "   } else if (operator == 2) {",
        "      return sourceIn(a, b);",

        "   } else if (operator == 3) {",
        "      return sourceOut(a, b);",

        "   } else if (operator == 4) {",
        "      return destinationOver(a, b);",

        "   } else if (operator == 5) {",
        "      return destinationAtop(a, b);",

        "   } else if (operator == 6) {",
        "      return destinationIn(a, b);",

        "   } else if (operator == 7) {",
        "      return destinationOut(a, b);",

        "   } else if (operator == 8) {",
        "      return xor(a, b);",

        "   } else if (operator == 9) {",
        "      return multiply(a, b);",

        "   } else if (operator == 10) {",
        "      return difference(a, b);",

        "   } else if (operator == 11) {",
        "      return colorDodge(a, b);",

        "   } else if (operator == 12) {",
        "      return colorBurn(a, b);",

        "   } else if (operator == 13) {",
        "      return hardLight(a, b);",

        "   } else if (operator == 14) {",
        "      return lighter(a, b);",
        "   }",

        "   return sourceOver(a, b);",
        "}",

        "void main() {",
        "   vec2 uvB = vec2(vUv);",
        "   if (flipXb == 0) {",
        "      uvB.x = 1.0 - uvB.x;",
        "   }",
        "   if (flipYb == 0) {",
        "      uvB.y = 1.0 - uvB.y;",
        "   }",

        "   vec4 texB = texture2D(tBase, uvB);",
        "   texB.a *= alphaB;",
        "   if (transparency < 1.0) {",
        "      float f = 1.0-transparency;",
        "      vec4 b = vec4(0.0, 0.0, 0.0, f);",
        "      texB = operator(texB, b, 0);",
        "   }",
        "   vec4 col = texB;",

        "   if (merge == 1) {",
        "      vec4 texA = texture2D(tAdd, vUv);",
        "      col = operator(texB, texA, operation);",
        "   }",
        "   gl_FragColor = col;",
        "}"

    ].join( "\n" )

};
