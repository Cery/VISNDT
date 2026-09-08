from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:3000/search?q=三维扫描')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='f:\\Desktop\\VISNDT\\search-3dscan.png', full_page=True)
    print('saved', page.url)
    browser.close()
