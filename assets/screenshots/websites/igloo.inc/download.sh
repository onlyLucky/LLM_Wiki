#!/bin/bash
# igloo.inc 资源批量下载脚本
cd ~/wiki/assets/screenshots/websites/igloo.inc

download() {
  local url="$1"
  local path="$2"
  if [ -f "$path" ]; then
    echo "[skip] $path"
    return
  fi
  mkdir -p "$(dirname "$path")"
  local code=$(curl -sS --max-time 120 --retry 3 -o "$path" -w "%{http_code}" "$url")
  if [ "$code" = "200" ]; then
    echo "[OK] $path"
  else
    rm -f "$path"
    echo "[FAIL $code] $path"
  fi
}

BASE="https://www.igloo.inc"

# JS 文件
download "$BASE/assets/index-2eb69c09.js" "assets/index-2eb69c09.js"
download "$BASE/assets/App3D-f554a111.js" "assets/App3D-f554a111.js"
download "$BASE/assets/msdfworker-ac346fa7.js" "assets/msdfworker-ac346fa7.js"
download "$BASE/assets/bitmapworker-046527f8.js" "assets/bitmapworker-046527f8.js"
download "$BASE/assets/exrworker-41cbee65.js" "assets/exrworker-41cbee65.js"
download "$BASE/assets/audioworker-036a09db.js" "assets/audioworker-036a09db.js"

# Draco 解码器
download "$BASE/assets/libs/draco/draco_decoder.wasm" "assets/libs/draco/draco_decoder.wasm"
download "$BASE/assets/libs/draco/draco_wasm_wrapper.js" "assets/libs/draco/draco_wasm_wrapper.js"

# Basis 纹理解码器
download "$BASE/assets/libs/basis/basis_transcoder.js" "assets/libs/basis/basis_transcoder.js"
download "$BASE/assets/libs/basis/basis_transcoder.wasm" "assets/libs/basis/basis_transcoder.wasm"

# 字体
download "$BASE/assets/fonts/IBMPlexMono-Medium.json" "assets/fonts/IBMPlexMono-Medium.json"
download "$BASE/assets/fonts/IBMPlexMono-Medium-datatexture.ktx2" "assets/fonts/IBMPlexMono-Medium-datatexture.ktx2"

# Favicon
download "$BASE/assets/favicon32-af94112f.png" "assets/favicon32-af94112f.png"

# DRC 模型
for f in mountain.drc ground.drc igloo.drc intro_particles.drc blurrytext.drc \
  shattered_ring2.drc floor.drc blurrytext_cylinder.drc smoke_trail.drc \
  shattered_ring_smoke.drc ceilingsmoke.drc pudgy.drc overpass_logo.drc \
  abstractlogo.drc shattered_ring.drc; do
  download "$BASE/assets/geometries/$f" "assets/geometries/$f"
done

# igloo 子目录 DRC
for f in igloo_cage.drc igloo_outline.drc patch.drc; do
  download "$BASE/assets/geometries/igloo/$f" "assets/geometries/igloo/$f"
done

# cubes 子目录 DRC
for f in background_shapes.drc cube1.drc cube2.drc cube3.drc; do
  download "$BASE/assets/geometries/cubes/$f" "assets/geometries/cubes/$f"
done

# KTX2 纹理 - 根目录
for f in scroll-datatexture.ktx2 frost-datatexture.ktx2 wind_noise.ktx2 \
  perlin-datatexture.ktx2 clouds_noise.ktx2 bokeh.ktx2 mosaic.ktx2 \
  shapes_blurred.ktx2 floor_color.ktx2 pudgy_dark_color.ktx2 caustics.ktx2 \
  overpass_logo_dark_color.ktx2 abstractlogo_dark_color.ktx2 \
  numbers-datatexture.ktx2 shattered_ring2_color.ktx2 shattered_ring2_ao.ktx2 \
  shattered_ring_color.ktx2 shattered_ring_ao.ktx2; do
  download "$BASE/assets/images/$f" "assets/images/$f"
done

# KTX2 纹理 - noises
download "$BASE/assets/images/noises/blue-8-128-rgb.ktx2" "assets/images/noises/blue-8-128-rgb.ktx2"

# KTX2 纹理 - ui
for f in logo-datatexture.ktx2 sound-datatexture.ktx2 close-datatexture.ktx2 \
  arrow-datatexture.ktx2 visit-datatexture.ktx2; do
  download "$BASE/assets/images/ui/$f" "assets/images/ui/$f"
done

# KTX2 纹理 - igloo
for f in triangles_tiling.ktx2 igloo_scene.ktx2 mountain_color.ktx2 \
  ground_color.ktx2 ground_glow.ktx2 ground_sansigloo_color.ktx2 \
  igloo_color.ktx2 igloo_exploded_color.ktx2 numbers.ktx2; do
  download "$BASE/assets/images/igloo/$f" "assets/images/igloo/$f"
done

# KTX2 纹理 - cubes
for f in dot_pattern.ktx2 cube_scene.ktx2 blurrytext_atlas.ktx2 \
  cube3_roughness.ktx2 cube3_normal.ktx2 pudgy_color.ktx2 \
  cube2_roughness.ktx2 abstractlogo_color.ktx2 cube2_normal.ktx2 \
  cube1_roughness.ktx2 cube1_normal.ktx2 overpass_logo_color.ktx2; do
  download "$BASE/assets/images/cubes/$f" "assets/images/cubes/$f"
done

# KTX2 纹理 - volumes
for f in peachesbody_64.ktx2 x_64.ktx2 medium_32.ktx2; do
  download "$BASE/assets/images/volumes/$f" "assets/images/volumes/$f"
done

# OGG 音频
for f in music-highq.ogg wind.ogg room.ogg igloo.ogg beeps.ogg beeps2.ogg \
  beeps3.ogg click-project.ogg enter-project.ogg leave-project.ogg \
  shard.ogg project-text.ogg circles.ogg particles.ogg logo.ogg \
  ui-long.ogg manifesto.ogg ui-short.ogg; do
  download "$BASE/assets/audio/$f" "assets/audio/$f"
done

echo ""
echo "=== 下载完成 ==="
