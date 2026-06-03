#!/usr/bin/env python3
"""Download all product + brand images to public/assets, rewrite products.json img paths."""
import json, pathlib, urllib.request, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
APP_PUB = ROOT / "app" / "public" / "assets"
(APP_PUB / "products").mkdir(parents=True, exist_ok=True)
(APP_PUB / "brand").mkdir(parents=True, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

def fetch(url, dest):
    if dest.exists() and dest.stat().st_size > 0:
        return True
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=60) as r:
            dest.write_bytes(r.read())
        return dest.stat().st_size > 0
    except Exception as e:
        print(f"  FAIL {url}: {e}")
        return False

def ext_of(url):
    m = re.search(r"\.(jpg|jpeg|png|webp|gif|avif)", url.split("?")[0], re.I)
    return m.group(1).lower() if m else "jpg"

products = json.loads((ROOT / "data" / "products.json").read_text())
total = ok = 0
for p in products:
    pdir = APP_PUB / "products" / p["handle"]
    pdir.mkdir(parents=True, exist_ok=True)
    newpaths = []
    for i, url in enumerate(p["images"]):
        dest = pdir / f"{i+1}.{ext_of(url)}"
        total += 1
        if fetch(url, dest):
            ok += 1
        newpaths.append(f"/assets/products/{p['handle']}/{dest.name}")
    p["imagePaths"] = newpaths
(ROOT / "data" / "products.json").write_text(json.dumps(products, indent=2, ensure_ascii=False))
print(f"product images: {ok}/{total} downloaded")

# brand logo (light + dark variants seen in footer)
brand = {
    "logo-dark.png": "https://veeluxapparel.com/cdn/shop/files/ChatGPT_Image_Jul_7_2025_07_33_23_PM.png?v=1751913411",
    "logo-light.png": "https://veeluxapparel.com/cdn/shop/files/B5680E21-1533-42F5-B5AD-FBB1067987C1-removebg-preview.png?v=1751913444",
}
for name, url in brand.items():
    if fetch(url, APP_PUB / "brand" / name):
        print(f"  brand/{name} ok")
