import { recipes } from "../data/recipes.js";

/**
 * Finds recipes that contain what the user typed into the Main Search Bar.
 * @param {string} input - Characters a user types into the searchbar.
 * @returns {array} - An array containing only those recipes that match user input.
 */
export function searchRecipes(input) {
  function isAMatch(recipe) {
    const userInput = input.toLowerCase();
    const recipeName = recipe.name.toLowerCase();
    const recipeDescription = recipe.description.toLowerCase();
    const recipeIngredients = [];

    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ingredient = recipe.ingredients[i].ingredient.toLowerCase();
      recipeIngredients.push(ingredient);
    }

    function containsMatchingIngredient(userInput) {
      let containsMatchingIngredient = false;

      for (let i = 0; i < recipeIngredients.length; i++) {
        if (recipeIngredients[i].includes(userInput)) {
          containsMatchingIngredient = true;
          break;
        } 
      }

      return containsMatchingIngredient;
    } 

    if (recipeName.includes(userInput) ||
        recipeDescription.includes(userInput) ||
        containsMatchingIngredient(userInput)) {
      return true;
    } else {
      return false;
    }
  }

  const searchResults = [];

  for (let i = 0; i < recipes.length; i++) {
    if (isAMatch(recipes[i])) {
      searchResults.push(recipes[i]);
    }
  }

  return searchResults;
}