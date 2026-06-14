#!/usr/bin/env python3
"""igloo.inc 离线服务器"""

import http.server
import os
import urllib.parse

PORT = 5502  # shader.se 用 5501，follow.art 用 5500
ROOT = os.path.dirname(os.path.abspath(__file__))

class OfflineHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        """重写路径转换，正确处理查询参数"""
        idx = path.find("?")
        if idx >= 0:
            path = path[:idx]
        path = urllib.parse.unquote(path)
        path = path.replace("\\", "/")
        while "//" in path:
            path = path.replace("//", "/")
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
        status = str(args[1]) if len(args) > 1 else ""
        if "200" not in status:
            super().log_message(format, *args)


if __name__ == "__main__":
    with http.server.HTTPServer(("", PORT), OfflineHandler) as httpd:
        print(f"igloo.inc 离线服务器启动: http://127.0.0.1:{PORT}/")
        print(f"根目录: {ROOT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")
