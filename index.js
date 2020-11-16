import express from 'express';
import { read } from './jsonFileStorage.js';

const app = express();
const PORT = 3004;
app.set('view engine', 'ejs');
app.use(express.static('public'));

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
    else if ((chosenIndex > data.recipes.length) || (chosenIndex >= 0 === false)) {
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
    // create a variable to allow easy access to the object's keys
    const objectToDisplay = data.recipes;
    const categoriesArray = [];
    // store all categories in an array (ignore those that have no categories)

    data.recipes.forEach((element) => {
      if ('category' in element) {
        categoriesArray.push(element.category);
      }
    });
    // remove duplicate elements in the categories array
    const uniqueCategoriesArray = [...new Set(categoriesArray)];
    res.render('mainPage', { objectToDisplay, uniqueCategoriesArray });
  });
};

const displayCategoryPage = (req, res) => {
  const { categoryName } = req.params;
  console.log('categoryName is:');
  console.log(categoryName);
  console.log('-end-');

  read('data.json', (data) => {
  // loop through each object in data.json
  // create variable that easily acccesses the array wiithin the data.json
    const recipeData = data.recipes;

    // create a variable to store the objects with categories
    const arrayOfRecipesToDisplay = [];
    // loop within the array to identify which objects have a 'category';
    recipeData.forEach((element) => {
      if (('category' in element) && (element.category === categoryName)) {
        // if the item contains 'category', add it to an object that you are going to display
        arrayOfRecipesToDisplay.push(element);
      }
    });
    const objectToDisplay = { arrayOfRecipesToDisplay, categoryName };
    // console.log(arrayOfRecipesToDisplay);
    res.render('categoryPage', { objectToDisplay });
  });
};
// listen on a port and execute a call-back when triggered
app.get('/recipe/:index', getRecipeAtIndexX);
app.get('/yield/:yieldNumber', getRecipesWYieldNumX);
app.get('/', displayMainPage);
app.get('/category/:categoryName', displayCategoryPage);
app.listen(PORT);
