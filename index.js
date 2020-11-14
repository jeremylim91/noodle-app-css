import express from 'express';
import { read } from './jsonFileStorage.js';

const app = express();
const PORT = 3004;
app.set('view engine', 'ejs');

const getRecipeAtIndexX = (req, res) => {
  const chosenIndex = req.params.index;
  console.log(`Chosen index is: ${chosenIndex}`);

  // read the data.json file
  read('data.json', (data, error) => {
    if (error) {
      console.log(`Read error: ${error}`);
    }
    // if chosenIndex is larger than the length of data.recipes, it must be an invalid path;
    // additionally, if chosenIndex is not a number, it must be an invalid path;
    else if ((chosenIndex > data.recipes.length) || (chosenIndex > 0 === false)) {
      // response.send(' Error 404- Page not found');
      res.status(404).send('Sorry, we cannot find that!');
      return;
    }
    // manage content to be displayed
    const ObjectToDisplay = data.recipes[chosenIndex];
    res.render('recipePage', ObjectToDisplay);
  });
};

const getRecipesWYieldNumX = (req, res) => {
  const yieldNum = req.params.yieldNumber;
  console.log(yieldNum);

  // read into the data.json
  read('data.json', (data, error) => {
    // store the object in a variable that makes its arrays more accessible
    const { recipes } = data;

    // create a variable to store output
    let content = '';
    // loop through the array to find object.Yields that match the YieldNum
    recipes.forEach((element, index) => {
      if (`${element.yield}` === yieldNum) {
        content += `${element.label}<br>`;
      }
    });
    // console.log(content);
    res.send(content);
  });
};

const displayMainPage = (req, res) => {
  read('data.json', (data) => {
    const objectToDisplay = data.recipes;
    console.log(objectToDisplay[0]);
    res.render('mainPage', { objectToDisplay });
  });
};
// listen on a port and execute a call-back when triggered
app.get('/recipe/:index', getRecipeAtIndexX);
app.get('/yield/:yieldNumber', getRecipesWYieldNumX);
app.get('/', displayMainPage);
app.listen(PORT);
