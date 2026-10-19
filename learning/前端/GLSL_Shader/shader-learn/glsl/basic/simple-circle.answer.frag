#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);
    // step(r, d) 在 d >= r 时为 1（圆外），d < r 时为 0（圆内）
    // 1.0 - step(...) 翻转：圆内为 1，圆外为 0
    float circle = 1.0 - step(0.3, d);
    gl_FragColor = vec4(vec3(circle), 1.0);
}
