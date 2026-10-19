#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);

    // TODO: 用 smoothstep 创建软边圆形遮罩
    // 提示：smoothstep(inner, outer, d)，让 d 在 0.2~0.3 之间平滑过渡
    // 用 1.0 - smoothstep(...) 让圆心为白色
    float mask = 0.0;

    gl_FragColor = vec4(vec3(mask), 1.0);
}
