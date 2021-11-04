/**
 * Shader Source https://www.shadertoy.com/view/wlGSzc
 */
{
    HC.plugins.mesh_material.floating_points = class Plugin extends HC.MeshShaderMaterialPlugin {
        static name = 'floating-points';
        shader = {
            uniforms: {
                uTime: {type: 'f', value: 1.0}
            },
            fragmentShader: `
                uniform float uTime;
                uniform vec2 resolution;
                varying vec2 vUv;
                
                float DistanceToLine(vec3 LineStart, vec3 LineEnd, vec3 Point)
                {
                    vec3 lineStartToEnd = LineEnd - LineStart;
                    return length(cross(Point - LineStart, lineStartToEnd))/length(lineStartToEnd);
                }
                
                void mainImage( out vec4 fragColor, in vec2 fragCoord )
                {
                    vec2 iResolution = vec2(1.);
                    // UV goes from -0.5 to 0.5 vertically
                    vec2 uv = (fragCoord - iResolution.xy * 0.5)/iResolution.y;
                    
                    float sineOfTime = sin(uTime*.5);
                    float cosineOfTime = cos(uTime*.5);
                    
                    vec3 rayOrigin = vec3(0, 0, -1.0 + sineOfTime * 0.25);
                    vec3 uvPoint = vec3(uv, 0);
                    
                    float filledIn = 0.0;
                
                    for (float x = -1.0; x <= 1.0; x += 0.5)
                    {
                        for (float y = -1.0; y <= 1.0; y += 0.5)
                        {
                            for (float z = -1.0; z <= 1.0; z += 0.5)
                            {
                                vec3 point = vec3(x, y, z + 5.0);
                                point.x += sineOfTime * 0.75;
                                point.z -= cosineOfTime * 0.75;
                                point.y -= (cosineOfTime + sineOfTime) * 0.75;
                                point.x += (fract(x * 47350.6 - y * 7076.5 + z * 3205.25 + sin(uTime * x * y * z) * 0.5) - 0.5) * 1.75;
                                point.y += (fract(-x * 155.2 + y * 2710.66 + z * 71820.43 - cos(uTime * x * y * z) * 0.5) - 0.5) * 1.75;
                                point.z += (fract(x * 21255.52 + y * 510.16 - z * 6620.73 - cos(uTime * x * y * z) * 0.5) - 0.5) * 1.75;
                                
                                float distanceToLine = DistanceToLine(rayOrigin, uvPoint, point);
                                float radius = 1.0 - (fract(x * 61250.955 + y * 163.135 + z * 6207.58) * 0.125 + 0.025);
                                float intensity = 0.25 * fract(x * 1050.25 + y * -8415.95 + z * 120.01);
                                float distanceFwidth = fwidth(distanceToLine);
                                filledIn += intensity * smoothstep(radius - distanceFwidth, radius, 1.0 - distanceToLine);
                                
                                // Glow
                                filledIn += max(0.01, sineOfTime * 0.5 + 1.0 - distanceToLine) * 0.01;
                            }
                        }
                    }
                    
                    vec3 color = filledIn * vec3(uv.x + 0.5, uv.y + 0.5, uv.x * uv.y + 0.5) * (max(0.5, (cos(uTime * 0.35 + 0.25) + 0.5)) * 10.0);
                    
                    fragColor = vec4(color, 1);
                }
                
                void main() {
                    mainImage(gl_FragColor, vUv);
                }
                `
            ,
            vertexShader: "varying vec2 vUv;void main(){vUv = uv;vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_Position = projectionMatrix * mvPosition;}"
        }
    }
}
