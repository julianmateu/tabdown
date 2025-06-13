#!/bin/bash

output="extension.zip"

zip "${output}" \
  index.html \
  manifest.json \
  script.js \
  icon-128.png

echo "Created file ${output}."
