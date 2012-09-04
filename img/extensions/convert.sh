for file in *.png
do
  convert -thumbnail 100x46 "$file" thumb_"$file"
done
