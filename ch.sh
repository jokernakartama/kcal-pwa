IS_CHANGED=${$(head -n 1 CHANGELOG.md) != $(git describe --abbrev=0)}
if IS_CHANGED; then
  cat <<EOT
  ## $(git describe --abbrev=0)

  $(git cat-file tag $(git describe --abbrev=0) | tail -n+6)
EOT