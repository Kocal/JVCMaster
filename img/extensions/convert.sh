for file in *.png
do
  convert -thumbnail 150x80 "$file" thumb_"$file"
done
