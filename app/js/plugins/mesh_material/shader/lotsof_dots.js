/**
 * Shader Source https://www.shadertoy.com/view/MsVczc
 */
{
    HC.plugins.mesh_material.lotsof_dots = class Plugin extends HC.MeshShaderMaterialPlugin {
        static name = '531441-dots';
        shader = {
            uniforms: {
                uTime: {type: 'f', value: 1.0}
            },
            fragmentShader: `
                uniform float uTime;
                uniform vec2 resolution;
                uniform sampler2D iChannel0;
                varying vec2 vUv;
                
                vec3 mcol(vec3 pos,float t){
                    return vec3(1.);//cos(texture2D(iChannel0,pos*.0009+vec3(23.4*sin(t*.000034),12.5*sin(t*.000103),11.2*sin(t*.000074))).xyz*acos(-1.))+1.0)*.5;
                }
                
                void mainImage( out vec4 fragColor, in vec2 fragCoord ){
                    vec3 iResolution = vec3(1.);
                    const float aa=3.;
                    float t=uTime*.5;
                    vec3 camback=normalize(vec3(sin(t*.567+6.),sin(t*1.459+23.7),sin(t*.393)));
                    vec3 campos=110.*camback;
                    vec3 camrot=normalize(cross(vec3(sin(t*.767+3.),sin(t*1.259+23.7),sin(t*.593+.4)),campos));
                    vec3 camrot2=cross(camrot,camback);
                    vec4 col=vec4(0.0,0.0,0.0,1.0);
                    const float invaa=1./aa;
                    float aax,aay;
                    for(aax=.5*invaa;aax<1.;aax+=invaa){
                        for(aay=.5*invaa;aay<1.;aay+=invaa){
                            vec2 uv=(fragCoord+vec2(aax,aay)-iResolution.xy*.5)/iResolution.y;
                            vec3 ray=normalize(-camback+uv.x*camrot+uv.y*camrot2);
                            vec3 absray=abs(ray);
                            vec3 ray1;
                            float camdist;
                            if(absray.x>absray.y && absray.x>absray.z){
                                ray1=ray/absray.x;
                                camdist=campos.x*ray1.x;
                            }
                            else if(absray.y>absray.z){
                                ray1=ray/absray.y;
                                camdist=campos.y*ray1.y;
                            }
                            else{
                                ray1=ray/absray.z;
                                camdist=campos.z*ray1.z;
                            }
                            vec3 testpoint=campos-ray1*(40.+camdist);
                            int d;
                            for(d=0;d<81;d++){
                                vec3 o=round(testpoint);
                                if(abs(o.x)<=40. && abs(o.y)<=40. && abs(o.z)<=40.){
                                    vec3 offset=campos-o;
                                       vec3 distvec=offset-ray*dot(offset,ray);
                                    if(dot(distvec,distvec)<.00889){
                                        col += vec4(mcol(o,uTime),0.0)*invaa*invaa;
                                        break;
                                    }
                                }
                                testpoint+=ray1;
                            }
                        }
                    }
                    fragColor=col;
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
