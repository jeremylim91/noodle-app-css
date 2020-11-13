import express from 'express';
import { read } from './jsonFileStorage.js';

const app = express();
const PORT = 3004;
app.set('view engine', 'ejs');

const displayMainPage = (req, res) => {
  read('data.json', (data) => {
    res.render('index', data);
  });
};

app.get('/', displayMainPage);
app.listen(PORT);
