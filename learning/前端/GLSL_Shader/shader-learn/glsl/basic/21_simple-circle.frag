#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);

    // TODO: 用 step(0.3, d) 判断是否在圆外，再取反，得到圆内为 1.0 的遮罩
    float circle = 0.0;

    gl_FragColor = vec4(vec3(circle), 1.0);
}
