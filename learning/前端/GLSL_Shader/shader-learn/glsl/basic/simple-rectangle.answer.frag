#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    // 用 step 组合四条边：每条边 step 结果为 1 表示"在边界内侧"
    // 四个结果相乘：只有四条边都满足时才为 1（矩形内）
    float x = step(0.2, vUv.x) * step(vUv.x, 0.8);
    float y = step(0.3, vUv.y) * step(vUv.y, 0.7);
    float rect = x * y;
    gl_FragColor = vec4(vec3(rect), 1.0);
}
