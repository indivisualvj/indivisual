//by mu6k
//License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
//
//muuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuusk!

// float hash(vec2 x)
// {
//     return fract(cos(dot(x.xy,vec2(2.31,53.21))*124.123)*412.0);
// }
//
// float hash(float x)
// {
//     return fract(sin(cos(x)*124.123)*421.321);
// }
//
//
// float geom(vec2 p)
// {
//     float q = 0.0;
//     for (float i = 0.0; i<10.0; i+=1.0)
//     {
//         q+=0.008+i*0.001;
//
//         vec2 op = p;
//
//         p.x+=p.y*sin(iTime*0.21)*0.1+sin(iTime*0.05)*1.2;
//         p.y-=p.x*cos(iTime*0.31)*0.1+cos(iTime*0.05)*1.2;
//
//
//         //p=mix(p,op,sin(iTime*0.11)*0.5+0.9);
//
//         vec2 w = mod(p,4.0);
//         if (texture(iChannel0,w*0.25).x<0.3-cos(iTime*0.61)*0.2)
//         {
//             break;
//         }
//
//         p*=1.2;
//     }
//     return q;
// }
//
//
// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
//     vec2 uv = fragCoord.xy / iResolution.xy;
//
//     uv-=vec2(0.5);
//
//     uv.x*=iResolution.x/iResolution.y;
//
//     float q = 0.0;
//     vec2 p = uv;
//
//
//     float b = 1.0+length(p);
//     b+=texture(iChannel0,uv*1.4).x*0.1;
//     b+=sin(iTime)*0.01;
//     p*=(b);
//
//     p.x+=sin(iTime*0.2)*2.0;
//     p.y+=cos(iTime*0.2)*2.0;
//
//
//     q= geom(p*0.1+uv*1.0);
//
//     float gg =0.0;
//
//     for (float g=0.0; g<20.0; g+=1.0)
//     {
//         float xg = g/20.0;
//         xg = pow(xg,0.5);
//         float lg = (g-1.0)/20.0;
//         lg = pow(lg,0.5);
//         gg+=geom(p*0.1+uv*(xg+hash(uv+p)*(xg-lg)));
//     }
//
//     q=mix(gg*.125,q,0.25);
//
//     vec4 col = vec4(q*4.0,q*3.0,q,1.0);
//
//     //col.xyz=uv.xyy;
//
//     col/=(b-0.61);
//     float h = hash(uv+col.xy);
//     col -= vec4(h,h,h,0.0)*0.025;
//
//     float w = col.x+col.y+col.z;
//     fragColor = mix(col,vec4(w,w,w,1.0)*0.5,w);
// }