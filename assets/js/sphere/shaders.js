/** GLSL for the particle sphere. Simplex noise by Ashima Arts / Stefan Gustavson (MIT). */

const noise = `
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
  float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;

export const vertexShader = noise + `
      uniform float uTime,uAmp,uPixel,uCam,uHover,uIntro; uniform vec2 uMouse; attribute float aRand;
      varying float vD; varying float vA; varying float vBand; varying float vIntro;
      void main(){
        vec3 n = normalize(position);
        float d = snoise(n*1.35 + vec3(uTime*.16, uTime*.11, 0.)) * .34
                + snoise(n*3.1 - vec3(0., uTime*.13, uTime*.09)) * .09;
        d += dot(n.xy, uMouse) * .22;
        // bulge toward the cursor: points facing the mouse direction get pushed out
        vec3 vn = normalize(normalMatrix * n);
        float facing = smoothstep(.55, 1., dot(vn, normalize(vec3(uMouse * 1.3, 1.))));
        d += facing * (.18 + uHover * .45);
        d += snoise(n*6. + vec3(uTime*.9)) * .06 * uHover;
        d *= uAmp;
        vec3 p = n * (1. + d);
        // opening burst: each particle leaves the center at its own moment, swirls, overshoots and settles
        float t = clamp((uIntro - aRand*.3) / .7, 0., 1.);
        float e = 1. - pow(1. - t, 3.);
        float ang = (1. - e) * 2.6;
        p = vec3(p.x*cos(ang) - p.z*sin(ang), p.y, p.x*sin(ang) + p.z*cos(ang)) * e * (1. + .4*sin(t*3.14159));
        vIntro = t;
        vD = d;
        vBand = abs(fract(p.y*7. + uTime*.08) - .5) * 2.;
        vec4 mv = modelViewMatrix * vec4(p,1.);
        vA = clamp(1. - (-mv.z - uCam + 1.) * .42, .14, 1.);
        gl_PointSize = uPixel * (1.3 + aRand*1.7) * (uCam / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`;

export const fragmentShader = `
      uniform vec3 uAccent,uPaper; varying float vD; varying float vA; varying float vBand; varying float vIntro;
      void main(){
        vec2 c = gl_PointCoord - .5; float r = length(c); if (r > .5) discard;
        float soft = smoothstep(.5, .1, r);
        vec3 col = mix(uPaper*.85, uAccent*1.25, smoothstep(-.02, .28, vD));
        col = mix(uAccent*1.7, col, smoothstep(.35, 1., vIntro));      // particles glow accent while in flight
        float band = .35 + .65 * smoothstep(.25, .75, vBand);
        gl_FragColor = vec4(col, soft * vA * band * .9 * smoothstep(0., .06, vIntro));
      }`;
