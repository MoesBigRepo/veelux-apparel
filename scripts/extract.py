#!/usr/bin/env python3
"""Normalize Veelux Shopify JSON into clean app data + an image manifest."""
import json, re, html, urllib.request, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
CPDIR = DATA / "collection_products"

def clean_html(s: str) -> str:
    if not s:
        return ""
    s = re.sub(r"<style.*?</style>", " ", s, flags=re.S)
    s = re.sub(r"<script.*?</script>", " ", s, flags=re.S)
    # keep paragraph breaks
    s = re.sub(r"</p>|<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n\n", s)
    return s.strip()

def img_clean(url: str) -> str:
    # strip shopify width params, keep version
    return url.split("?")[0] if url else url

# ---- products ----
raw = json.loads((DATA / "products_raw.json").read_text())["products"]
products = []
image_urls = set()
for p in raw:
    imgs = []
    for im in p.get("images", []):
        u = im["src"]
        imgs.append(u)
        image_urls.add(u)
    variants = [{
        "id": v["id"],
        "title": v["title"],
        "price": v["price"],
        "available": v.get("available", True),
        "sku": v.get("sku") or "",
        "option1": v.get("option1"),
        "option2": v.get("option2"),
        "option3": v.get("option3"),
    } for v in p.get("variants", [])]
    prices = [float(v["price"]) for v in p.get("variants", []) if v.get("price")]
    products.append({
        "handle": p["handle"],
        "title": p["title"].strip(),
        "vendor": p.get("vendor", "VEELUX"),
        "productType": p.get("product_type", ""),
        "tags": p.get("tags", []),
        "descriptionHtml": p.get("body_html") or "",
        "description": clean_html(p.get("body_html") or ""),
        "price": f"{min(prices):.2f}" if prices else "",
        "priceMax": f"{max(prices):.2f}" if prices else "",
        "options": p.get("options", []),
        "variants": variants,
        "images": imgs,
        "shopifyUrl": f"https://veeluxapparel.com/products/{p['handle']}",
    })
(DATA / "products.json").write_text(json.dumps(products, indent=2, ensure_ascii=False))
print(f"products.json: {len(products)} products, {len(image_urls)} unique product images")

# ---- collections ----
COLL_ORDER = ["new-arrivals","frontpage","men","womens-streetwear","hoodies","sweatpants",
              "jean","plain-jean-trouser","jacket","flannels","all-products","all"]
COLL_TITLES = {
    "frontpage":"Featured","jacket":"Jackets","all-products":"All Products","jean":"Jeans",
    "plain-jean-trouser":"Denim & Trousers","hoodies":"Hoodies","sweatpants":"Sweatpants",
    "men":"Men","womens-streetwear":"Women","flannels":"Flannels","new-arrivals":"New Arrivals",
    "all":"Shop All",
}
collections = []
for h in COLL_ORDER:
    f = CPDIR / f"{h}.json"
    if not f.exists():
        continue
    handles = [x["handle"] for x in json.loads(f.read_text()).get("products", [])]
    if not handles:
        continue
    collections.append({
        "handle": h,
        "title": COLL_TITLES.get(h, h.replace("-", " ").title()),
        "productHandles": handles,
    })
(DATA / "collections.json").write_text(json.dumps(collections, indent=2, ensure_ascii=False))
print(f"collections.json: {len(collections)} non-empty collections")

# ---- image manifest ----
(DATA / "image_manifest.txt").write_text("\n".join(sorted(image_urls)))
print(f"image_manifest.txt: {len(image_urls)} urls")
