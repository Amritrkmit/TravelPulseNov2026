"""Export Travel Pulse dashboard views to image-faithful, paginated PDFs.
Run while the dashboard is served at http://127.0.0.1:5500/TravelPulse2026V5OCT-main/index.html
Requires: pip install playwright pillow; python -m playwright install chromium
"""
import asyncio
import io
import re
import sys
from pathlib import Path
from PIL import Image
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout

URL = 'http://127.0.0.1:5500/TravelPulse2026V5OCT-main/index.html'
OUTPUT = Path(__file__).resolve().parent / 'pdf_export'
FINAL_PDF = OUTPUT / 'Travel_Pulse_Complete_Dashboard.pdf'
ALL_PAGES = []
VIEWPORT = {'width': 1600, 'height': 1000}
# A3 landscape aspect ratio = 420 / 297. At 1600 px width, each page is ~1131 px tall.
PAGE_RATIO = 420 / 297
WAIT_MS = 2200

# Verified against the uploaded TravelPulse2026V5OCT-main/index.html.
VIEWS = [
    ('Travel_Behaviour_Inspire', 'behaviour', None, '#stageInspire'),
    ('Travel_Behaviour_Plan', 'behaviour', None, '#stagePlan'),
    ('Travel_Behaviour_Book', 'behaviour', None, '#stageBook'),
    ('Travel_Behaviour_During_Trip', 'behaviour', None, '#stageOnTrip'),
    ('Travel_Sentiment_Source_Market', 'travel-sentiment', '#travelSentimentSourceTab', None),
    ('Travel_Sentiment_Destination_Market', 'travel-sentiment', '#travelSentimentDestinationTab', None),
    ('Airline_Overview', 'airline', None, None),
    ('Hotels_Overview', 'hotel', None, None),
    ('Segments_By_Age', 'segments', '#segmentAgeTab', None),
    ('Segments_By_Budget', 'segments', '#segmentBudgetTab', None),
]

async def wait_for_charts(page):
    await page.wait_for_timeout(WAIT_MS)
    await page.evaluate('''async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      await Promise.all(Array.from(document.images).map(im => im.complete ? null : new Promise(r => {im.onload=r; im.onerror=r;})));
    }''')
    # Trigger lazy chart/image rendering across the active view.
    height = await page.evaluate('Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)')
    for y in range(0, min(height, 100000), 700):
        await page.evaluate('(y) => window.scrollTo(0,y)', y)
        await page.wait_for_timeout(110)
    await page.evaluate('window.scrollTo(0,0)')
    await page.wait_for_timeout(1200)

async def select_view(page, tab, subtab=None, stage=None):
    await page.locator(f'button.tab[data-tab="{tab}"]').click(timeout=12000)
    await page.wait_for_timeout(1000)
    if subtab:
        await page.locator(subtab).click(timeout=12000)
        await page.wait_for_timeout(800)
    if stage:
        # Stage controls vary by dashboard version; find an interactive stage button.
        stage_name = {'#stageInspire':'Inspire','#stagePlan':'Plan','#stageBook':'Book','#stageOnTrip':'During trip'}[stage]
        candidate = page.locator('button, [role="tab"], .journey-tab, .stage-tab').filter(has_text=re.compile(r'^\s*'+re.escape(stage_name)+r'\s*$', re.I))
        clicked = False
        for i in range(await candidate.count()):
            item = candidate.nth(i)
            if await item.is_visible():
                await item.click(timeout=5000)
                clicked = True
                break
        if not clicked:
            print(f'  Stage control for {stage_name} not found; using stage section directly if visible.')
    await wait_for_charts(page)


def paginate_image(image: Image.Image):
    """Slice screenshot into A3-landscape-proportioned image pages without rescaling."""
    image = image.convert('RGB')
    page_height = max(1, round(image.width / PAGE_RATIO))
    pages = []
    for top in range(0, image.height, page_height):
        crop = image.crop((0, top, image.width, min(top + page_height, image.height)))
        if crop.height < page_height:
            sheet = Image.new('RGB', (image.width, page_height), 'white')
            sheet.paste(crop, (0, 0))
            crop = sheet
        pages.append(crop)
    return pages


def save_pdf(image, destination):
    pages = paginate_image(image)
    pages[0].save(destination, 'PDF', resolution=96, save_all=True, append_images=pages[1:])
    return len(pages)

async def capture(page, name, stage):
    # Stage-specific view: capture the actual section, not unrelated sections.
    if stage:
        section = page.locator(stage)
        if await section.count() and await section.is_visible():
            png = await section.screenshot(animations='disabled', timeout=120000)
        else:
            print(f'  WARNING: {stage} is not visible. Skipping rather than exporting wrong content.')
            return False
    else:
        # Full-page screenshots preserve on-screen CSS colors and gradients.
        png = await page.screenshot(full_page=True, animations='disabled', timeout=120000)
    image = Image.open(io.BytesIO(png)).convert('RGB')
    if image.width < 200 or image.height < 150:
        print(f'  WARNING: suspiciously small capture {image.size}; skipped.')
        return False
    pages = paginate_image(image)
    ALL_PAGES.extend(pages)
    print(f'  Captured {name} ({len(pages)} page(s), {image.width}x{image.height}px)')
    return True

async def main():
    OUTPUT.mkdir(exist_ok=True, parents=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=False, args=['--disable-dev-shm-usage'])
        page = await browser.new_page(viewport=VIEWPORT, device_scale_factor=1, color_scheme='light')
        try:
            response = await page.goto(URL, wait_until='domcontentloaded', timeout=30000)
            if response and response.status >= 400:
                raise RuntimeError(f'Dashboard returned HTTP {response.status}')
        except Exception as exc:
            print('Cannot open the dashboard. Start VS Code Live Server and check URL:', URL)
            print('Details:', exc)
            await browser.close()
            return 1
        print('Dashboard opened. Log in if needed, then press Enter in this terminal.')
        await asyncio.to_thread(input)
        successful = 0
        for name, tab, subtab, stage in VIEWS:
            print('Exporting', name)
            try:
                await select_view(page, tab, subtab, stage)
                if await capture(page, name, stage):
                    successful += 1
            except Exception as exc:
                print(f'  ERROR in {name}: {type(exc).__name__}: {exc}')
        await browser.close()
    if ALL_PAGES:
        ALL_PAGES[0].save(FINAL_PDF, 'PDF', resolution=96, save_all=True, append_images=ALL_PAGES[1:])
        print(f'ONE combined PDF: {FINAL_PDF} ({len(ALL_PAGES)} pages; {successful}/{len(VIEWS)} views)')
    else:
        print('No views captured; PDF not created.')
    return 0 if successful == len(VIEWS) else 2

if __name__ == '__main__':
    sys.exit(asyncio.run(main()))
