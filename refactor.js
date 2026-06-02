const fs = require('fs');

const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Extrair CSS
const styleRegex = /<style>([\s\S]*?)<\/style>/;
const styleMatch = content.match(styleRegex);
if (styleMatch) {
    const cssContent = styleMatch[1].trim();
    fs.writeFileSync('style.css', cssContent);

    const seoTags = `
  <!-- SEO & Open Graph -->
  <meta name="description" content="Gustavo Henrique - Especialista em implantação de Landing Pages de alta conversão. Transforme seu tráfego em clientes com páginas que vendem.">
  <meta property="og:title" content="Gustavo HB | Especialista em Conversão">
  <meta property="og:description" content="Implantação de Landing Pages de conversão para transformar tráfego em contatos e vendas.">
  <meta property="og:image" content="https://iadigitall.github.io/porti/capa.jpg">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta name="author" content="Gustavo Henrique">

  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Gustavo HB | Especialistas em Conversão",
    "image": "https://iadigitall.github.io/porti/capa.jpg",
    "description": "Especialista em implantação de Landing Pages para conversão de vendas.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Brasília",
      "addressCountry": "BR"
    },
    "url": "https://iadigitall.github.io/porti/"
  }
  </script>

  <!-- CSS e Preloads -->
  <link rel="preload" href="style.css" as="style">
  <link rel="stylesheet" href="style.css">`;
    content = content.replace(styleRegex, seoTags);
}

// 2. Extrair JS inline no body (Ignorar tailwind ou lucide icons e pegar só a lógica modal/animações)
const scriptRegex = /<script>\s*\/\/ ===== Modal Logic[\s\S]*?<\/script>/;
const scriptMatch = content.match(scriptRegex);
if (scriptMatch) {
    let jsContent = scriptMatch[0].replace(/<script>|<\/script>/g, '').trim();
    fs.writeFileSync('script.js', jsContent);
    content = content.replace(scriptRegex, '<script src="script.js" defer></script>');
}

// 3. Adicionar loading="lazy" e Acessibilidade (A11y)
content = content.replace(/<img src="https:\/\/images\.unsplash\.com/g, '<img loading="lazy" src="https://images.unsplash.com');
content = content.replace(/<img src="certi/g, '<img loading="lazy" src="certi');
content = content.replace(/<button class="modal-close">/g, '<button class="modal-close" aria-label="Fechar Modal">');
content = content.replace(/<button id="toTop" class="to-top btn btn-ghost">/g, '<button id="toTop" class="to-top btn btn-ghost" aria-label="Voltar ao topo">');

// 4. Salvar Alterações
fs.writeFileSync(path, content);
console.log('SUCESSO: Conversao feita pelo Node.js');
