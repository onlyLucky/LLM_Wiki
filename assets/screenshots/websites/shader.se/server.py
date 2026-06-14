#!/usr/bin/env python3
"""shader.se 离线服务器"""

import http.server
import os
import urllib.parse

PORT = 5501  # 使用不同端口避免与 follow.art 冲突
ROOT = os.path.dirname(os.path.abspath(__file__))

class OfflineHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        """重写路径转换，正确处理查询参数"""
        # 分离查询字符串
        idx = path.find("?")
        if idx >= 0:
            path = path[:idx]
        # URL 解码
        path = urllib.parse.unquote(path)
        # 清理路径
        path = path.replace("\\", "/")
        while "//" in path:
            path = path.replace("//", "/")
        # 拼接绝对路径
        words = [w for w in path.split("/") if w and w not in (".", "..")]
        result = ROOT
        for word in words:
            _, word = os.path.split(word)
            if word in (os.curdir, os.pardir):
                continue
            result = os.path.join(result, word)
        return result

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, format, *args):
        # 只记录非 200 的请求
        status = str(args[1]) if len(args) > 1 else ""
        if "200" not in status:
            super().log_message(format, *args)


if __name__ == "__main__":
    with http.server.HTTPServer(("", PORT), OfflineHandler) as httpd:
        print(f"shader.se 离线服务器启动: http://127.0.0.1:{PORT}/")
        print(f"根目录: {ROOT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")
