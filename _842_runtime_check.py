import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
VIEWPORTS = [(375, 812), (768, 1024), (1440, 900)]
pages = ["/", "/products", "/categories", "/knowledge-base", "/knowledge", "/solutions", "/search?q=%E5%B7%A5%E4%B8%9A%E5%86%85%E7%AA%A5%E9%95%9C", "/search"]

def run():
    out = {}
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        for vw in VIEWPORTS:
            ctx = b.new_context(viewport={"width": vw[0], "height": vw[1]})
            pg = ctx.new_page()
            console_err = []
            pg.on("console", lambda m: console_err.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: console_err.append("PAGEERROR: " + str(e)))
            for path in pages:
                key = f"{path}@{vw[0]}"
                try:
                    resp = pg.goto(BASE + path, wait_until="networkidle", timeout=25000)
                    pg.wait_for_timeout(900)
                    status = resp.status if resp else "null"
                    h1 = pg.locator("h1").count()
                    h1text = [pg.locator("h1").nth(i).inner_text().strip() for i in range(h1)] if h1 else []
                    overflow = pg.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth")
                    out[key] = {"status": status, "h1": h1, "overflow": bool(overflow), "title": pg.title().strip(), "h1text": h1text}
                except Exception as e:
                    out[key] = {"error": str(e)}
            try:
                r = pg.request.get(BASE + "/sitemap.xml")
                out["sitemap.status"] = r.status
                out["sitemap.urls"] = r.text().count("<url>")
                out["sitemap.sample"] = r.text()[:240]
            except Exception as e:
                out["sitemap.error"] = str(e)
            try:
                r2 = pg.request.get(BASE + "/robots.txt")
                out["robots.status"] = r2.status
                out["robots.body"] = r2.text()
            except Exception as e:
                out["robots.error"] = str(e)
            out["console_errors"] = console_err[:10]
            ctx.close()
        b.close()
    return out

print(json.dumps(run(), ensure_ascii=False, indent=1))