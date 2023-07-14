// Import data.
import { recipes } from "./data/recipes.js";

// Import utilities.
import { validate } from "./utils/validate.js";
// import { combinationFilter } from "./utils/filter.js";
import { noMatchingRecipes as errorNoMatchingRecipes } from "./utils/error.js";

// Import classes.
import RecipeCard    from "./models/RecipeCard.js";
import Dropdown      from "./models/Dropdown.js";
import FilterList    from "./models/FilterList.js";
import RecipeCounter from "./models/RecipeCounter.js";

/**
 * Extracts and formats data from the database and uses that data to render the three dropdown filters.
 * @returns {void}
 */
function renderDropdowns() {
  // Build and format a list of all available ingredients so that it can be used for rendering the ingredients dropdown.
  let ingredients = recipes.map(recipe => recipe.ingredients);
  ingredients = ingredients.flat(); // Results in 254 items, potentially containing duplicates.
  ingredients = ingredients.map(ingredientObject => ingredientObject.ingredient);
  ingredients = [...new Set(ingredients)]; // Use a set to elimnate duplicates, then immediately convert the set back into an array. Results in 127 unique items.
  ingredients.sort(); // Sort the ingredients in alphabetical order.

  // Build and format a list of all available appliances so that it can be used for rendering the appliances dropdown.
  let appliances = recipes.map(recipe => recipe.appliance); // Results in 50 items, potentially containing duplicates.
  appliances = appliances.map(appliance => appliance.toLowerCase());
  appliances = [...new Set(appliances)]; // Use a set to elimnate duplicates, then immediately convert the set back into an array. Results in 11 unique items.
  appliances.sort(); // Sort the ingredients in alphabetical order.

  // Build and format a list of all available utensils so that it can be used for rendering the utensils dropdown.
  let utensils = recipes.map(recipe => recipe.utensils);
  utensils = utensils.flat(); // Results in 122 items, potentially containing duplicates.
  utensils = utensils.map(utensil => utensil.toLowerCase());
  utensils = [...new Set(utensils)]; // Use a set to elimnate duplicates, then immediately convert the set back into an array. Results in 30 unique items.
  utensils.sort(); // Sort the ingredients in alphabetical order.

  // Render the ingredients dropdown.
  const ingredientsDropdown = new Dropdown("Ingrédients", "ingredients", ingredients);
  ingredientsDropdown.init();

  // Render the appliances dropdown.
  const appliancesDropdown = new Dropdown("Appareils", "appliances", appliances);
  appliancesDropdown.init();

  // Render the utensils dropdown.
  const utensilsDropdown = new Dropdown("Ustensiles", "utensils", utensils);
  utensilsDropdown.init();
}

function renderRecipeCounter(numberOfRecipes) {
  const recipeCounter = new RecipeCounter(numberOfRecipes);
  recipeCounter.render();
}

export const filterList = new FilterList();

const recipesWrapper = document.querySelector(".recipes");

/**
 * Populates the page with recipe cards.
 * @param {array} recipes - All recipies or a subset of recipies that match the search parameters set by the user. 
 * @returns {void}
 */
function renderRecipes(recipes) {
  recipesWrapper.innerHTML = "";                    // Clear existing cards from the page.
  recipes.forEach(recipe => {                       // For each recipe:
    const thisRecipe = new RecipeCard(recipe);      // Create a new Recipe Card object.
    const thisRecipeCard = thisRecipe.renderCard(); // Use the new Recipe object to render a card.
    recipesWrapper.appendChild(thisRecipeCard);     // Add this card to the page.
  })
}

/**
 * Handles user input in the Main Search Bar.
 * @returns {void}
 */
function listenForUserInput() {
  const inputField = document.querySelector(".searchbar__input");

  // A switch to prevent unnecessary rerendering of Recipe Cards (e.g. when user input is below minimum length).
  let recipeCardRenderingDisabled = true;

  inputField.addEventListener("input", (e) => {
    const userInput = e.target.value;
    const userInputIsValid = validate(userInput);

    if (userInputIsValid) {
      recipeCardRenderingDisabled = false;
      const matchingRecipes = findMatches(userInput);
      if (matchingRecipes.length < 1) { errorNoMatchingRecipes(userInput) };
      renderRecipes(matchingRecipes);
      renderRecipeCounter(matchingRecipes.length);      
    } else if (!userInputIsValid && !recipeCardRenderingDisabled) {
      recipeCardRenderingDisabled = true;
      renderRecipes(recipes);
      renderRecipeCounter(recipes.length);
    }
  });
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
 * Establishes an explicit order of function execution.
 * @returns {void}
 */
function init() {
  renderDropdowns(); // Render all dropdowns.
  renderRecipeCounter(recipes.length); // Render the recipe counter.
  renderRecipes(recipes); // Render all recipes on the page for the first time.
  listenForUserInput(); // Activate event listeners on the main searchbar. 
}

init();