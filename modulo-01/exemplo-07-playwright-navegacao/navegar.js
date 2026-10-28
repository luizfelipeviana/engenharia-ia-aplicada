import { chromium } from 'playwright';

const url = 'https://erickwendel.com';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });

const title = await page.title();

const menuLinks = await page.$$eval('a', (anchors) =>
  anchors
    .map((a) => ({ text: a.textContent.trim(), href: a.href }))
    .filter((a) => a.text.length > 0)
);

const bodyText = await page.innerText('body');

console.log('=== TITLE ===');
console.log(title);
console.log('\n=== URL ===');
console.log(page.url());
console.log('\n=== LINKS (primeiros 40) ===');
console.log(JSON.stringify(menuLinks.slice(0, 40), null, 2));
console.log('\n=== BODY TEXT ===');
console.log(bodyText);

await browser.close();
