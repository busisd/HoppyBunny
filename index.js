const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'))

app.get('/', (req, res) => res.sendFile('public/index.html', { root: __dirname }));
app.get('/test', (req, res) => res.sendFile('public/test1.html', { root: __dirname }));
app.get('/fixed', (req, res) => res.sendFile('public/fixed_size_game.html', { root: __dirname }));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

