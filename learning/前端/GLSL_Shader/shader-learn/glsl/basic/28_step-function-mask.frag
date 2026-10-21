#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec3 leftColor = vec3(1.0, 0.4, 0.4);
    vec3 rightColor = vec3(0.4, 0.4, 1.0);

    // TODO: 使用 step(0.5, vUv.x) 生成遮罩 mask（左侧 0，右侧 1）
    float mask = 0.0;

    // TODO: 使用 mix(leftColor, rightColor, mask) 得到最终颜色
    vec3 color = leftColor;

    gl_FragColor = vec4(color, 1.0);
}
