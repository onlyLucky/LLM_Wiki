#!/bin/bash
# 下载所有缺失的图片资源
IPX="_ipx"
BASE="https://follow.art/_ipx"

download_ipx() {
    local params="$1"
    local img_path="$2"
    local dir="$IPX/$params"
    local dest="$dir/$img_path"
    
    if [ -f "$dest" ]; then
        return 0
    fi
    
    mkdir -p "$(dirname "$dest")"
    local url="$BASE/$params/$img_path"
    local code=$(curl -sS -o "$dest" -w "%{http_code}" --connect-timeout 5 "$url")
    if [ "$code" = "200" ]; then
        echo "[OK] $params/$img_path"
    else
        rm -f "$dest"
        echo "[FAIL $code] $params/$img_path"
    fi
}

# === Card-1 到 Card-9 (1.intro/webgl) ===
# 使用 s_2048x2048 avif 和 webp 两种格式
PARAMS_WEBP="v_1781268325088&f_webp&s_3072x3072"
PARAMS_AVIF="v_1781268325088&f_avif&s_2048x2048"

for i in $(seq 1 9); do
    download_ipx "$PARAMS_WEBP" "images/landing/1.intro/webgl/Card-$i.png"
    download_ipx "$PARAMS_AVIF" "images/landing/1.intro/webgl/Card-$i.png"
done

# === Review-1 到 Review-8 (9.testimonials) ===
for i in $(seq 1 8); do
    download_ipx "$PARAMS_WEBP" "images/landing/9.testimonials/Review-$i.png"
    download_ipx "$PARAMS_AVIF" "images/landing/9.testimonials/Review-$i.png"
done

# === trail-1 到 trail-18 (10.join-us) ===
for i in $(seq 1 18); do
    download_ipx "$PARAMS_WEBP" "images/landing/10.join-us/trail-$i.png"
done

# === nexus cards (3.nexus) ===
for i in 1 2; do
    download_ipx "$PARAMS_WEBP" "images/landing/3.nexus/card-$i.png"
    download_ipx "$PARAMS_AVIF" "images/landing/3.nexus/card-$i.png"
done

# === connectory image (7.connectory) ===
download_ipx "$PARAMS_WEBP" "images/landing/7.connectory/image.png"
download_ipx "$PARAMS_AVIF" "images/landing/7.connectory/image.png"

echo ""
echo "=== 下载完成 ==="
