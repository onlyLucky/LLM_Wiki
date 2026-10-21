#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);

    // TODO: 用 step(0.3, d) 取反，得到圆内为 1 的遮罩 circle
    float circle = 1.0 - step(0.3, d);

    vec3 bg = vec3(0.06, 0.07, 0.1);
    vec3 fg = vec3(0.2, 0.85, 1.0);
    gl_FragColor = vec4(mix(bg, fg, circle), 1.0);
}
