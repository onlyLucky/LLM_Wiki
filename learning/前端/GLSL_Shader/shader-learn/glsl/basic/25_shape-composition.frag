#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

float rectMask(vec2 uv, vec2 center, vec2 halfSize) {
    vec2 d = abs(uv - center);
    float insideX = 1.0 - step(halfSize.x, d.x);
    float insideY = 1.0 - step(halfSize.y, d.y);
    return insideX * insideY;
}

void main() {
    vec2 uv = vUv;

    // TODO: 1) 用 step 构造矩形遮罩 rect（提示：比较 abs(uv - center) 与 halfSize）
    float rect = rectMask(uv, vec2(0.5), vec2(0.38, 0.1));

    // TODO: 2) 用 smoothstep 构造圆形遮罩 circle（提示：circle = 1.0 - smoothstep(r, r+aa, length(uv-0.5))）
    vec2 p = uv - 0.5;
    float r = 0.22;
    float aa = 0.008;
    float circle = 1.0 - smoothstep(r, r + aa, length(p));

    // TODO: 3) 用 max(rect, circle) 合并成 combined
    float combined = max(rect, circle);

    vec3 bg = vec3(0.07, 0.08, 0.12);
    vec3 fg = vec3(0.35, 1.0, 0.65);
    vec3 color = mix(bg, fg, combined);

    gl_FragColor = vec4(color, 1.0);
}
