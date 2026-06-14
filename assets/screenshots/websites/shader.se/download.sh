#!/bin/bash
# shader.se 资源批量下载脚本
cd ~/wiki/assets/screenshots/websites/shader.se

download() {
  local url="$1"
  local path="$2"
  if [ -f "$path" ]; then
    echo "[skip] $path"
    return
  fi
  mkdir -p "$(dirname "$path")"
  local code=$(curl -sS --max-time 30 -o "$path" -w "%{http_code}" "$url")
  if [ "$code" = "200" ]; then
    echo "[OK] $path"
  else
    rm -f "$path"
    echo "[FAIL $code] $path"
  fi
}

# _next/ JS/CSS/SVG/字体
download "https://www.shader.se/_next/static/media/62c2ceb5e93c1826-s.p.0-v~mv8_r_vtm.woff2?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/media/font.woff2"
download "https://www.shader.se/_next/static/chunks/0l.t8ml2224no.css?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/main.css"
download "https://www.shader.se/_next/static/chunks/07k6izpr80.um.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/07k6izpr80.um.js"
download "https://www.shader.se/_next/static/chunks/0f9pmwk9~iqf..js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/0f9pmwk9.iqf.js"
download "https://www.shader.se/_next/static/chunks/17.79-onzp9ko.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/17.79-onzp9ko.js"
download "https://www.shader.se/_next/static/chunks/01rpcm9oxyz4o.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/01rpcm9oxyz4o.js"
download "https://www.shader.se/_next/static/chunks/turbopack-06237-s6b4.it.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/turbopack.js"
download "https://www.shader.se/_next/static/chunks/03r54qy_a1k2c.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/03r54qy_a1k2c.js"
download "https://www.shader.se/_next/static/chunks/0_2dh_hbsn4k2.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/0_2dh_hbsn4k2.js"
download "https://www.shader.se/_next/static/chunks/003qcun9_z40b.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/003qcun9_z40b.js"
download "https://www.shader.se/_next/static/chunks/0_4n59_u4tn.y.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/0_4n59_u4tn.y.js"
download "https://www.shader.se/_next/static/chunks/09d2g3rtnbzgs.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/09d2g3rtnbzgs.js"
download "https://www.shader.se/_next/static/chunks/12vmxu4i7-3qm.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/12vmxu4i7-3qm.js"
download "https://www.shader.se/_next/static/chunks/0nr6lqdt2xw72.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/0nr6lqdt2xw72.js"
download "https://www.shader.se/_next/static/chunks/0-4avss~~5x31.js?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/chunks/0-4avss.5x31.js"
download "https://www.shader.se/_next/static/media/logo.0ctv.ko5~mr~7.svg?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/media/logo.svg"
download "https://www.shader.se/_next/static/media/logo_dark.0a~p9g3zi7_h6.svg?dpl=dpl_7zBfSoUTJP474MZeo1QBxkHKryUu" "_next/static/media/logo_dark.svg"

# 3D 模型
download "https://www.shader.se/models/computer.glb" "models/computer.glb"
download "https://www.shader.se/models/deskbox.glb" "models/deskbox.glb"
download "https://www.shader.se/models/shredder.glb" "models/shredder.glb"
download "https://www.shader.se/models/tie.glb" "models/tie.glb"
download "https://www.shader.se/models/phones.glb" "models/phones.glb"
download "https://www.shader.se/models/trophy2.glb" "models/trophy2.glb"
download "https://www.shader.se/models/bank.glb" "models/bank.glb"

# 纹理图片
for f in grunge.webp dirt.jpg smoke.png boot_screen_mobile.png boot_screen.png thumb_fallback.png rgba_noise.png bank_wall.webp bank_scratches.webp bank_metal.webp; do
  download "https://www.shader.se/textures/$f" "textures/$f"
done

# 图标
for f in pointing_hand_light.svg arrow_right_white.svg spinner.png old_phone.svg close_icon.svg menu.svg old_phone_dark.svg menu_dark.svg; do
  download "https://www.shader.se/textures/icons/$f" "textures/icons/$f"
done

# 其他纹理
for f in group_3x2.webp jake_computer.webp jacob_presenting.webp simon_presenting.webp computer.webp customers_logo_cloud.png dashed_border_horizontal_dark.png dashed_border_vertical_dark.png dashed_frame.svg scissors.png filip_footer_5.webp footer_certificate.png copyright_footer.png simon_calling.webp a11y-statement.png trophy2.webp accessibility_statement.webp; do
  download "https://www.shader.se/textures/$f" "textures/$f"
done

# Mux 图片
for id in LbdE02DF9Gx1iVtxU98nv6uOtEEmQkTSs00Uyqb6O0201Tw 83n4y2fZh2ztnRDEkkHBr2CxcTt9ofYGNL601sy9bpW00 caSLneThURyYn402mCTXi6sgHLpL2F0201EcF01rI3ZwKk8 byyZFSODgpXF2dwVzYl1sLBSfpwUw4mHYhWiqT3qRZ4 JFKPwSwJdrTK6zn1c013dCw5HTxkekifCD8cbWWmd7JQ cUnrcyhPVk47A500005QHTfK00wUyr201vc2NEORq5ybaCE hrfPaZr4FOpHh2iiUzTz01ppZApstkbjMH01vyZ5bDEg8 crXxuu5ds7W2UrGP1JE00V01xgtotSe02OOUojNBKjprKg WR4ERwHNIF5rXY9l026yYwwacbpWgU7q3FrYxKYwqDrY Y7HzOsrmhjd7M00Ib6JYF861ME00I3ZqicLcr4V9vhoXU 29xq00NijxLTofeMmyr1hvjJjStsZbMzzOBnP8JN24NM; do
  download "https://www.shader.se/api/mux-image/$id/w800-h600-fpreserve-t0" "api/mux-image/$id/w800-h600.jpg"
done
download "https://www.shader.se/api/mux-image/gyP026f00GygEUVxzl6e4xG1hTvyPyf9DUFTMEok02FvDk/h640-fpreserve-t0" "api/mux-image/gyP026f00GygEUVxzl6e4xG1hTvyPyf9DUFTMEok02FvDk/h640.jpg"

# 字体数据
for f in stix_regular.json stix_medium.json stix_bold.json stix_regular.png stix_medium.png stix_bold.png; do
  download "https://www.shader.se/fonts/$f" "fonts/$f"
done

# 视频精灵图
for f in handshake.manifest.json handshake_sheet_000.avif handshake_sheet_001.avif handshake_sheet_002.avif; do
  download "https://www.shader.se/videos/prebaked/handshake_avif/$f" "videos/prebaked/handshake_avif/$f"
done

# icon
download "https://www.shader.se/icon.svg" "icon.svg"

echo ""
echo "=== 下载完成 ==="
