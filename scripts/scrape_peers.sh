#!/bin/bash
cd ~/projects/veelux-apparel
declare -A PEERS=(
  [represent]="https://representclo.com"
  [essentials]="https://fearofgod.com/collections/essentials"
  [ald]="https://www.aimeleondore.com"
  [rhude]="https://rhude.com"
  [gallerydept]="https://gallerydept.com"
)
scrape_one() {
  local name="$1" url="$2"
  firecrawl scrape "$url" --format screenshot,branding,markdown --json -o ".firecrawl/peers/$name.json" 2>/dev/null
  local shot
  shot=$(jq -r '.data.screenshot // .screenshot // empty' ".firecrawl/peers/$name.json")
  [ -n "$shot" ] && curl -s "$shot" -o ".firecrawl/peers/$name.png"
  echo "$name done"
}
export -f scrape_one
# 2 at a time
scrape_one represent "https://representclo.com" &
scrape_one essentials "https://fearofgod.com/collections/essentials" &
wait
scrape_one ald "https://www.aimeleondore.com" &
scrape_one rhude "https://rhude.com" &
wait
scrape_one gallerydept "https://gallerydept.com" &
wait
echo "ALL PEERS DONE"
