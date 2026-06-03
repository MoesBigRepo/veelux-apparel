#!/usr/bin/env python3
"""Extract clean main-content text from Veelux content pages -> content/*.md (full length)."""
import re, html, urllib.request, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "content"
OUT.mkdir(exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0"}

PAGES = {
    "about-us": "https://veeluxapparel.com/pages/about-us",
    "contact": "https://veeluxapparel.com/pages/contact",
    "refund-policy": "https://veeluxapparel.com/policies/refund-policy",
    "shipping-policy": "https://veeluxapparel.com/policies/shipping-policy",
}
# leftover unfilled Shopify theme placeholders to drop
NOISE = re.compile(r"^(Sub Title|Heading|Protection from the|-->)$", re.I)

def extract(url):
    req = urllib.request.Request(url, headers=UA)
    t = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "ignore")
    m = re.search(r"<main[^>]*>(.*?)</main>", t, re.S)
    b = m.group(1) if m else t
    b = re.sub(r"<style.*?</style>", " ", b, flags=re.S)
    b = re.sub(r"<script.*?</script>", " ", b, flags=re.S)
    b = re.sub(r"</p>|<br\s*/?>|</h[1-6]>", "\n", b, flags=re.I)
    txt = html.unescape(re.sub(r"<[^>]+>", " ", b))
    txt = re.sub(r"[ \t]+", " ", txt)
    lines = []
    for l in txt.split("\n"):
        l = l.strip()
        if not l or NOISE.match(l):
            continue
        if re.search(r"[{}]|customstyle|template--|@media|--g-|rgb\(|reCAPTCHA", l):
            continue
        lines.append(l)
    # dedupe consecutive
    out = []
    for l in lines:
        if not out or out[-1] != l:
            out.append(l)
    return "\n\n".join(out).strip()

for name, url in PAGES.items():
    txt = extract(url)
    (OUT / f"{name}.md").write_text(txt + "\n")
    print(f"{name}.md: {len(txt)} chars")
