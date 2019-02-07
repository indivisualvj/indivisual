/**
 * copy of something found on https://www.shadertoy.com/
 */

THREE.MpegShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"time":        { type: "f", value: 1.0 },
        "strength":     { type: "f", value: 1.0 },
        nSampler: { type: 't', value: 0, texture: null}

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"varying vec2 vUv;",
        "uniform sampler2D nSampler;",
        "uniform float time;",
        "uniform float strength;",

        "void main()",
        "{",
        "    vec2 uv = vUv;//gl_FragCoord.xy / iResolution.xy;",
        "    vec4 color = texture2D(tDiffuse, uv);",
        "    vec2 block = floor(gl_FragCoord.xy / vec2(16));",
        "    vec2 uv_noise = block / vec2(64);",
        "    uv_noise += floor(vec2(time) * vec2(1234.0, 3543.0)) / vec2(64);",

        "    float block_thresh = pow(fract(time * 1236.0453), 2.0) * 0.2;",
        "    float line_thresh = pow(fract(time * 2236.0453), 3.0) * 0.7;",

        "    vec2 uv_r = uv, uv_g = uv, uv_b = uv;",

        "    // glitch some blocks and lines",
        "    if (texture2D(nSampler, uv_noise).r < block_thresh ||",
        "        texture2D(nSampler, vec2(uv_noise.y, 0.0)).g < line_thresh) {",

        "        vec2 dist = (fract(uv_noise) - 0.5) * 0.3 * strength;",
        "        uv_r += dist * 0.1;",
        "        uv_g += dist * 0.2;",
        "        uv_b += dist * 0.125;",
        "    }",

        "    color.r = texture2D(tDiffuse, uv_r).r;",
        "    color.g = texture2D(tDiffuse, uv_g).g;",
        "    color.b = texture2D(tDiffuse, uv_b).b;",

        "    // loose luma for some blocks",
        "    if (texture2D(nSampler, uv_noise).g < block_thresh)",
        "        color.rgb = color.ggg;",

        "    // discolor block lines",
        "    if (texture2D(nSampler, vec2(uv_noise.y, 0.0)).b * 3.5 < line_thresh)",
        "        color.rgb = vec3(0.0, dot(color.rgb, vec3(1.0)), 0.0);",

        "    // interleave lines in some blocks",
        "    if (texture2D(nSampler, uv_noise).g * 1.5 < block_thresh ||",
        "        texture2D(nSampler, vec2(uv_noise.y, 0.0)).g * 2.5 < line_thresh) {",
        "        float line = fract(gl_FragCoord.y / 3.0);",
        "        vec3 mask = vec3(3.0, 0.0, 0.0);",
        "        if (line > 0.333)",
        "            mask = vec3(0.0, 3.0, 0.0);",
        "        if (line > 0.666)",
        "            mask = vec3(0.0, 0.0, 3.0);",

        "        color.xyz *= mask;",
        "    }",
        "    gl_FragColor = color;",
        "}",

	].join( "\n" )

};
