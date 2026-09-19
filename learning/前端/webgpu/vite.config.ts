import { defineConfig } from 'vite';

// 课程工程：每个 demo / 作业 / 参考答案目录自带 index.html。
// 开发时直接访问 /demos/day1/01-hello-triangle/index.html 即可，
// 或从根目录 index.html 门户页进入。
export default defineConfig({
  server: {
    port: 5173,
  },
});
