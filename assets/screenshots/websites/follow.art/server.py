#!/usr/bin/env python3
"""
offline_server.py — 离线网站本地服务器
支持：
1. URL 中 & 字符正确解析（不被当作查询参数）
2. /_ipx/ 图片智能回退：请求的变体不存在时，自动用已有的其他格式/尺寸替代
3. 常见 Web MIME 类型
"""

import http.server
import os
import urllib.parse
import posixpath

PORT = 5500
ROOT = os.path.dirname(os.path.abspath(__file__))

# 预建图片索引：image_subpath -> [available_dir1, available_dir2, ...]
_image_index = {}
_indexed = False

def _build_image_index():
    """扫描 _ipx 目录，建立 {图片相对路径: [所在目录列表]} 的索引"""
    global _image_index, _indexed
    if _indexed:
        return

    ipx_root = os.path.join(ROOT, "_ipx")
    if not os.path.isdir(ipx_root):
        _indexed = True
        return

    for dirpath, _, filenames in os.walk(ipx_root):
        for fn in filenames:
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ipx_root)
            # macOS 路径分隔符是 /
            parts = rel.split(os.sep, 1)
            if len(parts) == 2:
                param_dir, img_subpath = parts
                img_subpath_fwd = img_subpath.replace(os.sep, "/")
                if img_subpath_fwd not in _image_index:
                    _image_index[img_subpath_fwd] = []
                _image_index[img_subpath_fwd].append(param_dir)

    _indexed = True
    print(f"[index] 已索引 {len(_image_index)} 张图片，"
          f"{sum(len(v) for v in _image_index.values())} 个变体")


# 格式优先级：webp 最通用，其次 avif，其次 png，最后 jpeg
FORMAT_PRIORITY = {"webp": 0, "avif": 1, "png": 2, "jpeg": 3, "jpg": 3, "svg": 4}

def _pick_best_dir(dirs):
    """从可用目录列表中选最佳的（优先 webp，其次最大尺寸）"""
    def sort_key(d):
        fmt = "unknown"
        size = 0
        for part in d.split("&"):
            if part.startswith("f_"):
                fmt = part[2:]
            elif part.startswith("s_"):
                try:
                    w, h = part[2:].split("x")
                    size = int(w) * int(h)
                except:
                    pass
            elif part.startswith("w_"):
                try:
                    size = int(part[2:]) * 1000
                except:
                    pass
        return (FORMAT_PRIORITY.get(fmt, 99), -size)

    return sorted(dirs, key=sort_key)


class OfflineHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        """重写路径转换 — 关键：不把 & 当作查询参数分隔符"""
        # 先手动分割 query string（只在 ? 处分割，保留 & 在路径中）
        idx = path.find("?")
        if idx >= 0:
            path = path[:idx]

        # URL 解码
        path = urllib.parse.unquote(path)

        # 防止 .. 攻击
        path = path.replace("\\", "/")
        while "//" in path:
            path = path.replace("//", "/")

        # 拼接绝对路径
        words = path.split("/")
        words = filter(None, words)
        path = ROOT
        for word in words:
            drive, word = os.path.splitdrive(word)
            _, word = os.path.split(word)
            if word in (os.curdir, os.pardir):
                continue
            path = os.path.join(path, word)

        return path

    def do_GET(self):
        # 获取原始 URL 路径（保留 & 字符）
        parsed = urllib.parse.urlparse(self.path)
        url_path = urllib.parse.unquote(parsed.path)

        # 处理 /_ipx/ 智能回退
        if url_path.startswith("/_ipx/"):
            _build_image_index()

            ipx_content = url_path[6:]  # 去掉 /_ipx/
            parts = ipx_content.split("/", 1)
            if len(parts) == 2:
                requested_dir, img_subpath = parts
                full_path = os.path.join(ROOT, "_ipx", requested_dir, img_subpath)

                if not os.path.isfile(full_path):
                    if img_subpath in _image_index:
                        best_dirs = _pick_best_dir(_image_index[img_subpath])
                        for candidate_dir in best_dirs:
                            candidate = os.path.join(ROOT, "_ipx", candidate_dir, img_subpath)
                            if os.path.isfile(candidate):
                                self.path = f"/_ipx/{candidate_dir}/{img_subpath}"
                                print(f"[fallback] {requested_dir}/{img_subpath} -> {candidate_dir}/{img_subpath}")
                                break
                        else:
                            print(f"[404] {url_path} (有索引但文件都不在磁盘上)")
                    else:
                        # 模糊匹配
                        img_base = os.path.splitext(img_subpath)[0]
                        for indexed_path in _image_index:
                            if indexed_path.startswith(img_base):
                                best_dirs = _pick_best_dir(_image_index[indexed_path])
                                for candidate_dir in best_dirs:
                                    candidate = os.path.join(ROOT, "_ipx", candidate_dir, indexed_path)
                                    if os.path.isfile(candidate):
                                        self.path = f"/_ipx/{candidate_dir}/{indexed_path}"
                                        print(f"[fallback*] {img_subpath} -> {candidate_dir}/{indexed_path}")
                                        break
                                break

        return super().do_GET()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, format, *args):
        status = str(args[1]) if len(args) > 1 else ""
        if "200" not in status:
            super().log_message(format, *args)


if __name__ == "__main__":
    _build_image_index()
    with http.server.HTTPServer(("", PORT), OfflineHandler) as httpd:
        print(f"离线服务器启动: http://127.0.0.1:{PORT}/")
        print(f"根目录: {ROOT}")
        print(f"已索引图片: {len(_image_index)} 张")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")
