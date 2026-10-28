import { chromium } from 'playwright';

const url = 'https://forms.gle/5mGHXVKDLMFtjwBz7';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });

const title = await page.title();

const campos = await page.$$eval('div[role="listitem"]', (items) =>
  items.map((item) => {
    const heading = item.querySelector('div[role="heading"]');
    const texto = heading ? heading.textContent.trim() : item.textContent.trim().slice(0, 120);
    const obrigatorio = !!item.querySelector('span[aria-label="Obrigatório"], span.vnumgf');
    const radios = Array.from(item.querySelectorAll('div[role="radio"]')).map((r) =>
      (r.getAttribute('aria-label') || r.textContent || '').trim()
    );
    const tipo = item.querySelector('input[type="text"]')
      ? 'texto curto'
      : item.querySelector('textarea')
      ? 'paragrafo'
      : radios.length
      ? 'multipla escolha'
      : item.querySelector('div[role="list"] div[role="checkbox"]')
      ? 'caixas de selecao'
      : item.querySelector('div[role="listbox"]')
      ? 'lista suspensa'
      : 'desconhecido';
    return { texto, obrigatorio, tipo, opcoes: radios };
  })
);

console.log('=== TITLE ===');
console.log(title);
console.log('\n=== URL FINAL ===');
console.log(page.url());
console.log('\n=== CAMPOS ===');
console.log(JSON.stringify(campos, null, 2));

await browser.close();
