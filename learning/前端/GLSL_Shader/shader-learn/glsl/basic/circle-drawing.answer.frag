#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);
    // 用颜色感受距离场：圆内为蓝色，圆外为深色背景
    float circle = 1.0 - step(0.3, d);
    vec3 bg = vec3(0.06, 0.07, 0.1);
    vec3 fg = vec3(0.2, 0.85, 1.0);
    gl_FragColor = vec4(mix(bg, fg, circle), 1.0);
}
