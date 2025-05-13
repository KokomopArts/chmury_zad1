const path = require('path');
const express = require('express');
const dayjs = require('dayjs');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => {
	console.log('Autor aplikacji: Andrzej Kępa');
	console.log('Aplikacja nasłuchuje na porcie TCP: 8080');
	console.log(`Data uruchomienia: ${dayjs().add(2, 'hour').format('YYYY-MM-DD HH:mm:ss')}`);

});