const fs = require('fs');
const path = require('path');

// --- CONTEÚDO DOS ARQUIVOS ---

const files = {
  'package.json': JSON.stringify({
    "name": "portal-acqua-sistemas",
    "version": "1.0.0",
    "description": "Portal central do Grupo Alcina Maria",
    "main": "server.js",
    "scripts": {
      "start": "node server.js"
    },
    "dependencies": {
      "express": "^4.18.2"
    },
    "engines": {
      "node": ">=18.0.0"
    }
  }, null, 2),

  'server.js': `const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
    res.json({
        status: "ok",
        service: "portal-acqua-sistemas",
        timestamp: new Date().toISOString()
    });
});

app.get('/api/apps', (req, res) => {
    const configPath = path.join(__dirname, 'config', 'apps.json');
    fs.readFile(configPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erro ao ler apps.json:", err);
            return res.status(500).json([]);
        }
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            res.status(500).json([]);
        }
    });
});

app.get('*', (req, res) => {
    if (req.url.includes('setor')) {
        res.sendFile(path.join(__dirname, 'public', 'setor.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

app.listen(PORT, () => {
    console.log(\`Servidor rodando na porta \${PORT}\`);
});`,

  'render.yaml': `services:
  - type: web
    name: portal-acqua-sistemas
    env: node
    buildCommand: npm install
    startCommand: npm start
    plan: free
    healthCheckPath: /health`,

  '.gitignore': `node_modules/
.env
.DS_Store`,

  'README.md': `# Portal Acqua Sistemas
Portal corporativo do Grupo Alcina Maria.`,

  'config/apps.json': JSON.stringify([
    { "id": 1, "nome": "Ponto Eletrônico", "setor": "RH", "url": "https://google.com", "descricao": "Registro de ponto diário" },
    { "id": 2, "nome": "Holerites", "setor": "RH", "url": "https://google.com", "descricao": "Consulta de pagamentos" },
    { "id": 3, "nome": "Fluxo de Caixa", "setor": "FINANCEIRO", "url": "https://google.com", "descricao": "Controle financeiro" },
    { "id": 4, "nome": "Gestão de Leads", "setor": "COMERCIAL", "url": "https://google.com", "descricao": "CRM de Vendas" },
    { "id": 5, "nome": "Tickets TI", "setor": "ADMINISTRATIVO", "url": "https://google.com", "descricao": "Abertura de chamados" }
  ], null, 2),

  'config/apps.example.json': JSON.stringify([
    { "id": 0, "nome": "Exemplo", "setor": "SETOR", "url": "https://url.com", "descricao": "Descrição" }
  ], null, 2),

  'public/index.html': `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Acqua Sistemas</title>
    <link rel="stylesheet" href="assets/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="glow-bg"></div>
    <header>
        <div class="logo">
            <h1>PORTAL ACQUA SISTEMAS</h1>
            <p>GRUPO ALCINA MARIA</p>
        </div>
    </header>
    <main>
        <div class="grid-container" id="sectors-grid"></div>
    </main>
    <footer>© 2026 Acqua Sistemas</footer>
    <script src="assets/app.js"></script>
</body>
</html>`,

  'public/setor.html': `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setor - Acqua Sistemas</title>
    <link rel="stylesheet" href="assets/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="glow-bg"></div>
    <header>
        <h1 id="sector-title">...</h1>
        <a href="/" class="btn-back">← Voltar ao Portal</a>
    </header>
    <main>
        <div class="grid-container" id="apps-grid">
            <div class="loading">Carregando aplicações...</div>
        </div>
    </main>
    <script src="assets/setor.js"></script>
</body>
</html>`,

  'public/assets/style.css': `:root {
    --bg: #0d0e12;
    --card-bg: #15171e;
    --neon-blue: #0ff;
    --neon-pink: #f0f;
    --text: #e0e0e0;
}
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Outfit', sans-serif; }
body { background: var(--bg); color: var(--text); min-height: 100vh; display: flex; flex-direction: column; }
.glow-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 50% -20%, rgba(0, 255, 255, 0.1), transparent 60%); z-index: -1; }
header { text-align: center; padding: 3rem 1rem; }
h1 { font-size: 2rem; background: linear-gradient(90deg, var(--neon-blue), var(--neon-pink)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 20px rgba(0,255,255,0.3); }
p { letter-spacing: 3px; font-size: 0.8rem; opacity: 0.7; margin-top: 5px; }
main { flex: 1; max-width: 1200px; margin: 0 auto; width: 100%; padding: 2rem; }
.grid-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.card { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; cursor: pointer; transition: 0.3s; text-decoration: none; color: white; display: block; }
.card:hover { transform: translateY(-5px); border-color: var(--neon-blue); box-shadow: 0 0 20px rgba(0,255,255,0.1); }
.card h2 { margin-bottom: 0.5rem; font-weight: 500; }
.card span { font-size: 0.8rem; color: #888; }
.btn-back { display: inline-block; margin-top: 1rem; color: var(--neon-blue); text-decoration: none; border: 1px solid var(--neon-blue); padding: 0.5rem 1.5rem; border-radius: 20px; transition: 0.3s; }
.btn-back:hover { background: var(--neon-blue); color: #000; }
footer { text-align: center; padding: 2rem; opacity: 0.5; font-size: 0.8rem; }
.loading { grid-column: 1/-1; text-align: center; padding: 2rem; }`,

  'public/assets/app.js': `const sectors = ['RH', 'GENTE E CULTURA', 'FINANCEIRO', 'ADMINISTRATIVO', 'LOGISTICO', 'COMERCIAL', 'MARKETING'];
const grid = document.getElementById('sectors-grid');

sectors.forEach(sector => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => window.location.href = \`setor.html?key=\${encodeURIComponent(sector)}\`;
    card.innerHTML = \`<h2>\${sector}</h2><span>Acessar aplicações</span>\`;
    grid.appendChild(card);
});`,

  'public/assets/setor.js': `const params = new URLSearchParams(window.location.search);
const sectorKey = params.get('key');
const title = document.getElementById('sector-title');
const grid = document.getElementById('apps-grid');

if (!sectorKey) window.location.href = '/';
title.textContent = sectorKey;

fetch('/api/apps')
    .then(r => r.json())
    .then(apps => {
        const filtered = apps.filter(app => app.setor === sectorKey);
        grid.innerHTML = '';
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="loading">Nenhuma aplicação neste setor.</div>';
            return;
        }
        filtered.forEach(app => {
            const card = document.createElement('a');
            card.className = 'card';
            card.href = app.url;
            card.target = "_blank";
            card.rel = "noopener noreferrer";
            card.innerHTML = \`<h2>\${app.nome}</h2><span>\${app.descricao}</span>\`;
            grid.appendChild(card);
        });
    })
    .catch(() => grid.innerHTML = '<div class="loading">Erro ao carregar.</div>');`
};

// --- FUNÇÃO QUE ESCREVE ---
Object.keys(files).forEach(fileName => {
    const filePath = path.join(__dirname, fileName);
    // Garante que o diretório existe (ex: config, public/assets)
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    // Escreve o arquivo
    fs.writeFileSync(filePath, files[fileName]);
    console.log(`✅ Preenchido: ${fileName}`);
});

console.log("\n🚀 TUDO PRONTO! Agora rode: npm install && npm start");