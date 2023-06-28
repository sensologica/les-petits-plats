import {recipes} from "./data/recipes.js";
import Recipe from "./models/Recipe.js";
import Dropdown from "./models/Dropdown.js"

const recipesWrapper = document.querySelector(".recipes");

/**
 * Populates the page with recipe cards.
 * @param {array} recipes - All recipies or a subset of recipies that match the search parameters set by the user. 
 * @returns {void}
 */
function showRecipes(recipes) {
  recipesWrapper.innerHTML = "";                    // Clear existing cards from the page.
  recipes.forEach(recipe => {                       // For each recipe:
    const thisRecipe = new Recipe(recipe);          // Create a new Recipe object.
    const thisRecipeCard = thisRecipe.renderCard(); // Use the new Recipe object to render a card.
    recipesWrapper.appendChild(thisRecipeCard);     // Add this card to the page.
  })
}

/**
 * Checks if the searchbar input meets the minimum length requirements.
 * @param {string} input - What the user types into the searchbar.
 * @returns {boolean}
 */
function validate(input) {
  const minLength = 3;
  if (input.length < minLength) {
    console.log(`Error: The input string must contain ${minLength} or more characters.`);
    return false;
  } else {
    return true;
  }
}

/**
 * Finds recipes that contain strings that match user input.
 * @param {string} input - Characters a user types into the searchbar.
 * @returns {array} - An array containing only those recipes that match user input.
 */
function findMatches(input) {
  /**
   * Tests user input against fields of the recipe database to find matches.
   * @param {object} recipe - An object that represents a single recipe.
   * @returns {boolean} - True if there is a match, false otherwise.
   */
  function isAMatch(recipe) {
    // Use lowercase to ensure that there are no omissions due to case differences.
    const userInput = input.toLowerCase();
    const recipeName = recipe.name.toLowerCase();
    const recipeDescription = recipe.description.toLowerCase();
    const recipeIngredients = recipe.ingredients.map(ingredients => ingredients.ingredient.toLowerCase());

    if (recipeName.includes(userInput) ||
        recipeDescription.includes(userInput) ||
        recipeIngredients.some(ingredient => ingredient.includes(userInput))) {
      return true;
    } else {
      return false;
    }
  };

  // Filters all recipes to include only those recipes that match user search.
  const matches = recipes.filter(recipe => isAMatch(recipe)); 
  return matches;
}

/**
 * Listens for and reacts to user input on the main searchbar.
 * @returns {void}
 */
function listenForUserInput() {
  // This boolean "switch" allows us to test if all recipies are currently displayed on the homepage. 
  // If yes, then we do not rerender the recipe cards every time user input changes length (from 2 characters
  // to 1 and from 1 to 0). We only rerender the first time the input length goes from valid to invalid (from
  // 3 characters to 2 characters). Likewise, it does not rerender the page until the user input reaches the 
  // minimum required length of 3 characters. These checks are needed to prevent unncecessary computations
  // and to optimize the responsiveness of the UI.
  let showingAllRecipes = true;

  const inputField = document.querySelector(".searchbar__input");

  inputField.addEventListener("input", (e) => {
    let userInput = e.target.value;
    const inputIsValid = validate(userInput);

    if (inputIsValid) {
      showingAllRecipes = false;
      showRecipes(findMatches(userInput));
    } else if (!inputIsValid && !showingAllRecipes) {
      showingAllRecipes = true;
      showRecipes(recipes);
    }
  });
}

/**
 * Establishes an explicit order of function execution.
 * @returns {void}
 */
function init() {
  showRecipes(recipes); // Render all the recipes on the page for the first time.
  listenForUserInput(); // Activate event listeners on the main searchbar.
}

init();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// LABORATORY ////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let ingredients = recipes.map(recipe => recipe.ingredients);
ingredients = ingredients.flat();
ingredients = ingredients.map(ingredientObject => ingredientObject.ingredient);
ingredients = [...new Set(ingredients)]; // Eliminate duplicates. Converts array to set and then immediately back to array.
ingredients.sort();

let appliances = recipes.map(recipe => recipe.appliance); // 50 items. Potential duplicates.
appliances = appliances.map(appliance => appliance.toLowerCase());
appliances = [...new Set(appliances)]; // 11 items. No duplicates.
appliances.sort();

let utensils = recipes.map(recipe => recipe.utensils);
utensils = utensils.flat(); // 122 items. Potential duplicates.
utensils = utensils.map(utensil => utensil.toLowerCase());
utensils = [...new Set(utensils)]; // 30 items. No duplicates.
utensils.sort();

// Test data
// ingredients = ["Apple", "Banana", "Kiwi", "Mango", "Strawberry"];

const ingredientsDropdown = new Dropdown("Ingrédients", ingredients);
ingredientsDropdown.init();

const appliancesDropdown = new Dropdown("Appareils", appliances);
appliancesDropdown.init();

const utensilsDropdown = new Dropdown("Ustensiles", utensils);
utensilsDropdown.init();