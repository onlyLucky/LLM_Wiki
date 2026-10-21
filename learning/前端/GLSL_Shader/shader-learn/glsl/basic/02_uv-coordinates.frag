precision mediump float;

uniform vec2 u_resolution;

void main() {
    // 第一步：把像素坐标转成 0~1 的 UV
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // 目标：让画面从左边黑色渐变到右边白色
    // 只用 uv.x 来控制颜色亮度

    vec3 color = vec3(uv.x); // 修改这里

    gl_FragColor = vec4(color, 1.0);
}
