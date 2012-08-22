for file in *.png
do
  convert -thumbnail 150x76 "$file" thumb_"$file"
done
