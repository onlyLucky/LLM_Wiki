#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec2 p = vUv - 0.5;
    // TODO: 用 p + 0.5 计算颜色，赋值给 c
    vec3 c = vec3(0.0);
    gl_FragColor = vec4(c, 1.0);
}
