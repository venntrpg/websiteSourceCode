#!/usr/bin/env sh
set -e

ORIGINAL_DIR=$(pwd)

if [ ! -f "../vennt-scripts/weapon-parser/index.js" ]; then
    # This pulls in data generated by https://github.com/JackNolanDev/vennt-scripts
    # This repo and vennt-scripts need to be in the same directory for this to work
    echo "Vennt Scripts folder is not present"
    exit 1
fi

cd ../vennt-scripts/weapon-parser
if [ "$1" == "-r" ]; then
	node index.js
fi
cp -f weaponTypes.json "${ORIGINAL_DIR}/src/utils/data/weaponTypes.json"
echo "copied weaponTypes.json!"

cd ../item-parser
if [ "$1" == "-r" ]; then
	node index.js
fi
cp -f items.json "${ORIGINAL_DIR}/src/utils/data/items.json"
echo "copied items.json!"

cd "${ORIGINAL_DIR}"
