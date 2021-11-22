#!/bin/zsh
#magick mogrify -resize 16x12 -quality 100 -path ../new-thumbs *.jpg
for file in ./original/*.png; do
  base=$(basename "$file")
  echo "Processing $base"
  convert $file -interpolate Integer -filter point -resize "50%" "./scaled/$base"
done
