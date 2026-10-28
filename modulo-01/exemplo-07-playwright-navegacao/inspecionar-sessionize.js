import { chromium } from 'playwright';

const url = 'https://sessionize.com/erickwendel';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });

const title = await page.title();

const links = await page.$$eval('a', (anchors) =>
  anchors
    .map((a) => ({ text: a.textContent.trim(), href: a.href }))
    .filter((a) => a.href && !a.href.includes('sessionize.com/erickwendel#'))
);

const bodyText = await page.innerText('body');

console.log('=== TITLE ===');
console.log(title);
console.log('\n=== LINKS ===');
console.log(JSON.stringify(links, null, 2));
console.log('\n=== BODY TEXT ===');
console.log(bodyText);

await browser.close();
