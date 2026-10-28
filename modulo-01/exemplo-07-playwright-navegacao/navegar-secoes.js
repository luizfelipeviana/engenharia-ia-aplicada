import { chromium } from 'playwright';

const paginas = [
  { nome: 'ABOUT', url: 'https://erickwendel.com/about' },
  { nome: 'POSTS', url: 'https://erickwendel.com/posts/1' },
  { nome: 'VIDEOS', url: 'https://erickwendel.com/videos/1' },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const { nome, url } of paginas) {
  await page.goto(url, { waitUntil: 'networkidle' });
  const bodyText = await page.innerText('body');
  console.log(`\n=== ${nome} (${url}) ===`);
  console.log(bodyText);
}

await browser.close();
