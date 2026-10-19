precision mediump float;

uniform vec2 u_resolution;

void main() {
    // 把像素坐标除以画布尺寸，得到 0.0 ~ 1.0 的 UV
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    // uv.x 从左到右是 0.0 → 1.0，当作三个通道的亮度
    vec3 color = vec3(uv.x);
    gl_FragColor = vec4(color, 1.0);
}
