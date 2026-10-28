import { chromium } from 'playwright';

const url = 'https://sessionize.com/erickwendel';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });

const info = await page.evaluate(() => {
  const results = [];
  document.querySelectorAll('[class*="lang" i], [data-language], [id*="lang" i]').forEach((el) => {
    results.push({
      tag: el.tagName,
      id: el.id,
      class: el.className,
      dataset: JSON.stringify(el.dataset),
      textSnippet: el.textContent.trim().slice(0, 60),
    });
  });
  return results;
});
console.log(JSON.stringify(info, null, 2));

// tambem procurar o primeiro card de sessao e ver seu HTML completo
const cardHtml = await page.evaluate(() => {
  const el = document.querySelector('[class*="session" i]');
  return el ? el.outerHTML.slice(0, 3000) : 'not found';
});
console.log('\n=== SESSION CARD (approx) ===');
console.log(cardHtml);

await browser.close();
