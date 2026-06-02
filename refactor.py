import re
import os

html_path = 'index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extrair CSS
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if style_match:
    css_content = style_match.group(1).strip()
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css_content)
    # Substituir por link stylesheet e adicionar SEO tags
    seo_tags = """
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
  <link rel="stylesheet" href="style.css">"""
    
    # We replace the whole style tag including the tags themselves
    content = re.sub(r'<style>.*?</style>', seo_tags.replace('\\', '\\\\'), content, flags=re.DOTALL)

# 2. Extrair JS do form/ui (script inline)
# Find the script tag at the bottom (excluding external ones like tailwind or lucide)
body_script_match = re.search(r'<script>\s*// ===== Modal Logic.*?</script>', content, re.DOTALL)
if body_script_match:
    js_content = body_script_match.group(0).replace('<script>', '').replace('</script>', '').strip()
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    # Replace with external script tag
    content = content.replace(body_script_match.group(0), '<script src="script.js" defer></script>')

# 3. Adicionar loading="lazy" em imagens de portfólio que têm class "w-full" ou similares e os alt text update se tiver
content = content.replace('<img src="https://images.unsplash.com', '<img loading="lazy" src="https://images.unsplash.com')
content = content.replace('<img src="certi', '<img loading="lazy" src="certi')

# Adicionar aria-labels em links soltos (icones)
content = content.replace('<button class="modal-close">', '<button class="modal-close" aria-label="Fechar Modal">')
content = content.replace('<button id="toTop" class="to-top btn btn-ghost">', '<button id="toTop" class="to-top btn btn-ghost" aria-label="Voltar ao topo">')

# Reescrever index.html HTML
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCESSO: Conversão e Separação completadas!")
