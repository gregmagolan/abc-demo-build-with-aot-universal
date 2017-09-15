# requires brotli
# on Mac: brew install brotli

# distributions of brotli disagree on the name of the command
run_brotli() {
    if hash brotli 2>/dev/null; then
        brotli "$@"
    else
        bro "$@"
    fi
}

# measure the sizes of scripts the user will need to load
for script in dist/browser.js dist/server.js; do
  cp $script $script.bak
  # gzip on linux doesn't have --keep
  gzip -f $script
  mv $script.bak $script
  run_brotli --force --quality 10 --input $script --output $script.brotli
  ls -alH ${script}.gz ${script}.brotli
done
