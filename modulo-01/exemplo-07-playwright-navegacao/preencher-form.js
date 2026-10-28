import { chromium } from 'playwright';

const url = 'https://forms.gle/5mGHXVKDLMFtjwBz7';

const dados = {
  'Titulo': 'Web AI Além do Chat: Algoritmos Genéticos, RL e Transformers.js',
  'Descrição / Tópicos da Apresentação': `Web AI não é só "chamar uma API de LLM". Nesta palestra, você vai explorar um kit prático para criar funcionalidades de IA que rodam diretamente no navegador e no Node.js—sem custo por requisição e com privacidade como padrão. Você vai além do chat com Algoritmos Genéticos (otimização), Reinforcement Learning (agentes que tomam decisões) e Transformers.js como runtime para executar modelos baseados em transformers em JavaScript para visão, embeddings, classificação e muito mais. Você também verá como adicionar uma camada local de conhecimento usando SQLite compilado para WebAssembly para viabilizar experiências de RAG totalmente no dispositivo.

Temário:
- Web AI sem lock-in: o que já dá para fazer hoje
- Algoritmos Genéticos: otimização rápida e busca criativa
- Reinforcement Learning: agentes que aprendem por tentativa e recompensa
- Transformers.js: executando modelos transformer no browser/Node (não só chat)
- RAG local: embeddings + recuperação + SQLite/WASM
- Deploy para mobile/desktop: Workers, performance e padrões de UX`,
  'Seu Nome': 'Erick Wendel',
  'Seu Telefone': '',
  'Seu Email': '',
  'Mini Biografia': 'Erick Wendel é um colaborador coração do projeto do Node.js, keynote speaker e educador profissional. Ele já realizou mais de 100 palestras técnicas em mais de 20 países ao redor do mundo. Foi reconhecido como Especialista em Node.js com os prêmios Google Developer Expert, Microsoft MVP e GitHub Stars. Erick Wendel já treinou mais de 100.000 pessoas em todo o mundo através de sua própria empresa, https://ew.academy',
  'Github/Linkedin/blog': 'LinkedIn: https://linkedin.com/in/erickwendel/ | Blog: https://blog.erickwendel.com.br/',
};

const escolhaQuantasVezes = 'Mais de três vezes';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });

const items = await page.locator('div[role="listitem"]').all();

for (const item of items) {
  const heading = item.locator('div[role="heading"]').first();
  if (!(await heading.count())) continue;
  const textoBruto = (await heading.textContent()).trim();
  const texto = textoBruto.replace(/\s*\*$/, '').trim();

  if (dados[texto] !== undefined) {
    const valor = dados[texto];
    if (!valor) continue;
    const textarea = item.locator('textarea');
    const input = item.locator('input[type="text"]');
    if (await textarea.count()) {
      await textarea.first().fill(valor);
    } else if (await input.count()) {
      await input.first().fill(valor);
    }
    console.log(`Preenchido: "${texto}"`);
  } else if (texto.startsWith('Quantas vezes já palestrou')) {
    const radio = item.locator(`div[role="radio"][aria-label="${escolhaQuantasVezes}"]`);
    if (await radio.count()) {
      await radio.first().click();
      console.log(`Selecionado em "${texto}": ${escolhaQuantasVezes}`);
    }
  } else if (texto.startsWith('Você já participou do NodeBR')) {
    console.log(`Campo "${texto}" NÃO preenchido — não há dado no Sessionize para responder isso.`);
  }
}

await page.screenshot({ path: 'form-preenchido.png', fullPage: true });
console.log('\nFormulário preenchido. Screenshot salvo em form-preenchido.png.');
console.log('Navegador permanece aberto para você validar. NÃO foi clicado em Enviar.');

// Mantém o navegador aberto indefinidamente para validação manual
await new Promise(() => {});
