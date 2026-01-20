const express = require('express');
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
    console.log(`Servidor rodando na porta ${PORT}`);
});