#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);
    // smoothstep(0.2, 0.3, d)：d 在 0.2~0.3 之间平滑从 0 过渡到 1
    // 1.0 - ... 让圆心为白色，圆外为黑色
    float mask = 1.0 - smoothstep(0.2, 0.3, d);
    gl_FragColor = vec4(vec3(mask), 1.0);
}
