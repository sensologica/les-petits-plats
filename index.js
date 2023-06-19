import {recipes} from "./data/recipes.js";
import Recipe from "./models/Recipe.js";

const recipesWrapper = document.querySelector(".recipes");

recipes.forEach(recipe => {
  const thisRecipe = new Recipe(recipe);
  recipesWrapper.appendChild(thisRecipe.renderCard());
});


////////////////////////////////////////

// Get a list of ingredients from every recipe. This gives us a list of lists.
const allRecipesIngredientLists = recipes.map(recipe => recipe.ingredients);

// Go into each recipe and into each of the recipe's ingredients and push every
// found ingredient into a new array. This array will contain duplicates. 
const allIngredients = [];
allRecipesIngredientLists.forEach(recipe => recipe.forEach(ingredient => allIngredients.push(ingredient.ingredient)));

// Eliminate all duplicate entries from the list, giving up a list of unique values only.
const uniqueIngredientsSet = new Set(allIngredients);

// Convert the set back into an array so we can use array methods on it.
const uniqueIngredients = Array.from(uniqueIngredientsSet);

// Sort the array in alphabetical order.
uniqueIngredients.sort();

// Example of how we can populate the dropdown with these ingredients
// uniqueIngredients.forEach(ingr => {
//   const e = document.createElement("p");
//   e.innerText = ingr;
//   recipesWrapper.appendChild(e);
// });