import{g as P,u as E,T as U,h as _,e as b,P as y,M as B}from"./DDeLs8Pd.js";import{e as O,a as h}from"./xAAeZd5K.js";import{d as L,t as w,as as j,Z as g,P as p,O as A,F as z,q as T,o as C,a as G,Q as I,R as i}from"./DJ9DjCKf.js";import{u as D}from"./CZViUPrJ.js";import"./DDyy-86R.js";const k=`#ifndef PI
#define PI 3.141592653589
#endif

#define BUBBLE_AMOUNT 0.2
#define BUBBLE_RADIUS 0.9

uniform vec2 mousePos;
uniform float progressStart;
uniform float progressEnd;
uniform float radius;
varying vec2 vUv;


float scaleValue(float value, float valueMin, float valueMax, float targetMin, float targetMax) {
    return clamp(targetMin + (value - valueMin) / (valueMax - valueMin) * (targetMax - targetMin), min(targetMin, targetMax), max(targetMin, targetMax));
}

vec4 bend(vec4 coords, float progressStart, float progressEnd) {
    vec4 bentCoords = coords;
    float yAnimationOffset = 0.25;

    // Include Y into the progress
    float adjustedProgress = progressStart + (1.0 - coords.y) * yAnimationOffset;

    if (progressStart > 0.5) {
        float endProgressStart = scaleValue(progressStart, 0.5, 1.0, 0.0, 1.0);
        adjustedProgress = progressStart * endProgressStart + adjustedProgress * (1.0 - endProgressStart);
    }

    float angle = (1.0 - adjustedProgress) * PI;
    float zOffset = (2.0 - cos(angle) * 2.0);

    #if USE_MOUSE
        float yOffset = (1.0 - progressStart) * 0.25 + progressEnd * 2.25;
    #else
        float yOffset = (1.0 - progressStart) * 0.55 + progressEnd * 2.25;
    #endif

    bentCoords.y = bentCoords.y * cos(angle) + yOffset;
    bentCoords.z = bentCoords.z * sin(angle) - zOffset;

    return bentCoords;
}

void main() {
    vUv = uv;

    // Progress effect
    vec4 bentPosition = bend(vec4(position, 1.0), progressStart, progressEnd);

    // Mouse effect
    vec4 pos = modelViewMatrix * bentPosition;
    vec4 posScreen = projectionMatrix * pos;
    vec3 posScreenNormalized = posScreen.xyz / posScreen.w;

    #if USE_MOUSE
        float mouseDistance = length(mousePos.xy - posScreenNormalized.xy);
        float displacementStrength = 1.0 - smoothstep(0.0, BUBBLE_RADIUS, mouseDistance);
        float displacement = displacementStrength * BUBBLE_AMOUNT;

        pos.z += displacement;
    #endif

    gl_Position = projectionMatrix * pos;
}
`,R=`varying vec2 vUv;
uniform sampler2D imageTexture;

void main() {
    gl_FragColor = texture2D(imageTexture, vUv);
}
`,V=1/460*540,N=L({__name:"Landing2GetSeenWebGl",setup(W){const n=w("container"),m=I(()=>n.value&&n.value.closest(".js-get-seen-section")||".js-get-seen-section"),{matches:l}=D({query:"sm-down"}),c=j(n),v=g(c.x,{lerp:.2}),S=g(c.y,{lerp:.2}),d={value:new P(.5,.5)};l.value||p([v.value,S.value],([e,t])=>{const o=e*2-1,s=t*2-1;d.value.set(o,s*-1)});const{svh:M}=A(),x=z(m),u={value:0},f={value:0};return p([x.position.top,M],([e,t])=>{const o=i(e/(t*100),.75,0,0,1,!0),s=i(e/(t*100),0,-2,0,1,!0),a=O(s),r=h(o-s);u.value=i(r,0,1,-.25,1),f.value=a}),T(()=>{if(n.value){const e=E({container:n.value,camera:{fov:28,near:0,far:200,position:[0,-.048,2.04],rotation:[0,0,0]},renderer:{transparent:!0}}),o=new U().load("/images/landing/2.get-seen/image.png"),s=new _({side:b,fragmentShader:R,vertexShader:k,uniforms:{imageTexture:{value:o},mousePos:d,progressStart:u,progressEnd:f},defines:{USE_MOUSE:l.value?0:1}}),a=new y(1,V,20,20),r=new B(a,s);e.scene?.add(r),e.start()}}),(e,t)=>(C(),G("div",{ref_key:"container",ref:n,class:"landing-2-get-seen-webgl"},null,512))}}),Z=Object.assign(N,{__name:"Landing2GetSeenWebGl"});export{Z as default};
