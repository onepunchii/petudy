#!/usr/bin/env bash
# public/brand/**/*.png (생성 원본) → 같은 위치 .webp 로 변환하고, 원본 PNG 는 design-src/brand 로 옮깁니다.
# design-src/ 는 .gitignore 처리(원본 보관용, 저장소 용량 절약)
set -euo pipefail
cd "$(dirname "$0")/.."
find public/brand -name '*.png' | while read -r f; do
  out="${f%.png}.webp"
  case "$f" in
    */icons/*) cwebp -quiet -q 88 -resize 640 0 "$f" -o "$out" ;;
    */guides/*) cwebp -quiet -q 80 -resize 1200 0 "$f" -o "$out" ;;
    *) cwebp -quiet -q 82 "$f" -o "$out" ;;
  esac
  mkdir -p "design-src/$(dirname "${f#public/}")"
  mv "$f" "design-src/${f#public/}"
done
du -sh public/brand
