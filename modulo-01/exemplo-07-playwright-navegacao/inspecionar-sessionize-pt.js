import { chromium } from 'playwright';

const url = 'https://sessionize.com/erickwendel';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });

// Clica no link "Portuguese" da navegação de idiomas das SESSIONS (data-type="sessions")
await page.evaluate(() => {
  document.querySelector('a.c-s-nav-lang__link[data-type="sessions"][data-language="pt"]').click();
  document.querySelector('a.c-s-nav-lang__link[data-type="speaker"][data-language="pt"]').click();
});
await page.waitForTimeout(1500);

const bodyText = await page.innerText('body');
console.log('=== BODY TEXT (apos clicar em Portuguese) ===');
console.log(bodyText);

await browser.close();
