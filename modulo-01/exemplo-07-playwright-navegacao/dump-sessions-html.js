import { chromium } from 'playwright';

const url = 'https://sessionize.com/erickwendel';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });

const html = await page.evaluate(() => {
  const el = document.getElementById('speaker-language');
  return el ? el.outerHTML + '\n\n--- PARENT ---\n' + el.parentElement.outerHTML.slice(0, 2000) : 'not found';
});
console.log(html);

await browser.close();
