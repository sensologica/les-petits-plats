// Import data.
import { recipes } from "./data/recipes.js";

// Import utilities.
import { validate } from "./utils/validate.js";
import { searchRecipes } from "./utils/search.js";
import { filterRecipes } from "./utils/filter.js";
import { intersect } from "./utils/intersect.js";
import { noMatchingRecipes as errorNoMatchingRecipes } from "./utils/error.js";

// Import classes.
import RecipeCard    from "./models/RecipeCard.js";
import Dropdown      from "./models/Dropdown.js";
import TagList    from "./models/TagList.js";
import RecipeCounter from "./models/RecipeCounter.js";

/**
 * Extracts and formats data from the database and uses that data to render the three dropdown menus.
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

export function renderRecipeCounter(numberOfRecipes) {
  const recipeCounter = new RecipeCounter(numberOfRecipes);
  recipeCounter.render();
}

export const tagList = new TagList();

const recipesWrapper = document.querySelector(".recipes");

/**
 * Populates the page with recipe cards.
 * @param {array} recipes - Each recipe will be used to create a Recipe Card. 
 * @returns {void}
 */
export function renderRecipes(recipes) {
  recipesWrapper.innerHTML = "";                    // Clear existing cards from the page.
  recipes.forEach(recipe => {                       // For each recipe:
    const thisRecipe = new RecipeCard(recipe);      // Create a new Recipe Card object.
    const thisRecipeCard = thisRecipe.renderCard(); // Use the new Recipe Card object to render a card.
    recipesWrapper.appendChild(thisRecipeCard);     // Add this card to the page.
  })
}

export let userInput = "";
export function setUserInput(input) {
  userInput = input;
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
    setUserInput(e.target.value);
    const userInputIsValid = validate(userInput);

    if (userInputIsValid) {
      recipeCardRenderingDisabled = false;
      updateResults();    
    } else if (!userInputIsValid && !recipeCardRenderingDisabled) {
      recipeCardRenderingDisabled = true;
      updateResults("reset"); // Passing "reset" as a flag resets the search results and circumvents the search function for as long as the input value remains invalid.
    }
  });
}

export function updateResults(flag) {
    const searchResults = (flag === "reset") ? searchRecipes("") : searchRecipes(userInput);
    if (searchResults.length < 1) { errorNoMatchingRecipes(userInput) };
    const filterResults = filterRecipes(recipes);
    const intersectionResults = intersect(searchResults, filterResults);
    renderRecipes(intersectionResults);
    renderRecipeCounter(intersectionResults.length); 
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