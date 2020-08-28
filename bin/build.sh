sapper build

echo "Gzipping client..."
zipFiles=`find __sapper__/build/client`
zipfiles+="template.html"
for file in $zipFiles
do
  if [ -f $file ]
  then
    gzip -k9 "$file"
  fi
done
