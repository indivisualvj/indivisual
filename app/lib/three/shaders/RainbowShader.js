/**
 * copy of something found on https://www.shadertoy.com/
 */

THREE.RainbowShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
        "time":     { type: "f", value: 1.0 },
        "threshold":     { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n "),

	fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform float time;",
        "uniform float threshold;",
        "varying vec2 vUv;",

        // Smooth HSV to RGB conversion
        "vec3 hsv2rgb_smooth( in vec3 c )",
        "{",
            "vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );",
            "rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	",
            "return c.z * mix( vec3(1.0), rgb, c.y);",
        "}",

        "float over_than=0.1999;",
        "void main()",
        "{",

            "vec2 uv = vUv;",

            "float clr =1.0*uv.y-(time/2.0);",
            "vec4 ocol = texture2D(tDiffuse,uv);",
            "vec3 tx=ocol.rgb;",
            "vec3 hsvColor = hsv2rgb_smooth(vec3(clr, 1.0, 1.0));",

            "over_than=max(0.1999,0.1999+sin(time/10.0)) * threshold;",

            "// ignore certain colors ! alien  cond ! if xx ? then zz  : then ww",
            "(tx.r>over_than)  ?  gl_FragColor = vec4(hsvColor, 1.0) : gl_FragColor=ocol;",
            "// avec if !!!",
            "if(tx.g>over_than) gl_FragColor = vec4(hsvColor, 1.0);else gl_FragColor=ocol;",
            "if(tx.b>over_than) gl_FragColor = vec4(hsvColor, 1.0);else gl_FragColor=ocol;",

        "}",
        
	].join( "\n ")

};
