#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    // 矩形范围：x: 0.2~0.8, y: 0.3~0.7
    // TODO: 用 step 判断 vUv.x 是否在 0.2~0.8 范围内，得到 x
    float x = step(0.2, vUv.x) * step(vUv.x, 0.8);
    // TODO: 用 step 判断 vUv.y 是否在 0.3~0.7 范围内，得到 y
    float y = step(0.3, vUv.y) * step(vUv.y, 0.7);

    float rect = x * y;
    gl_FragColor = vec4(vec3(rect), 1.0);
}
