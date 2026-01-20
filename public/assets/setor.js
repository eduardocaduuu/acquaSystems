const params = new URLSearchParams(window.location.search);
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
            card.innerHTML = `<h2>${app.nome}</h2><span>${app.descricao}</span>`;
            grid.appendChild(card);
        });
    })
    .catch(() => grid.innerHTML = '<div class="loading">Erro ao carregar.</div>');