const sectors = ['RH', 'GENTE E CULTURA', 'FINANCEIRO', 'ADMINISTRATIVO', 'LOGISTICO', 'COMERCIAL', 'MARKETING'];
const grid = document.getElementById('sectors-grid');

sectors.forEach(sector => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => window.location.href = `setor.html?key=${encodeURIComponent(sector)}`;
    card.innerHTML = `<h2>${sector}</h2><span>Acessar aplicações</span>`;
    grid.appendChild(card);
});