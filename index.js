// Import data.
import { recipes } from "./data/recipes.js";

// Import utilities.
import { sanitize } from "./utils/sanitize.js";
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
 * Extracts names of individual ingredients from a provided collection of recipes, and sorts them in alphabetical order.
 * @param {array} recipes - A collection of recipes the function will extract ingredients from.
 * @returns {array} - An array of ingredient names, sorted alphabetically.
 */
function extractIngredientsFrom(recipes) {
  let ingredients = recipes.map(recipe => recipe.ingredients);
  ingredients = ingredients.flat(); // May contain duplicates.
  ingredients = ingredients.map(ingredientObject => ingredientObject.ingredient);
  ingredients = [...new Set(ingredients)]; // Use a set to elimnate duplicates, then immediately convert the set back into an array.
  ingredients.sort(); // Sort the ingredients in alphabetical order.
  return ingredients;
}

/**
 * Extracts names of individual appliances from a provided collection of recipes, and sorts them in alphabetical order.
 * @param {array} recipes - A collection of recipes the function will extract appliances from.
 * @returns {array} - An array of appliance names, sorted alphabetically.
 */
function extractAppliancesFrom(recipes) {
  let appliances = recipes.map(recipe => recipe.appliance); // May contain duplicates.
  appliances = appliances.map(appliance => appliance.toLowerCase());
  appliances = [...new Set(appliances)]; // Use a set to elimnate duplicates, then immediately convert the set back into an array.
  appliances.sort(); // Sort the appliances in alphabetical order.
  return appliances;
}

/**
 * Extracts names of individual utensils from a provided collection of recipes, and sorts them in alphabetical order.
 * @param {array} recipes - A collection of recipes the function will extract utensils from.
 * @returns {array} - An array of utensil names, sorted alphabetically.
 */
function extractUtensilsFrom(recipes) {
  let utensils = recipes.map(recipe => recipe.utensils);
  utensils = utensils.flat(); // May contain duplicates.
  utensils = utensils.map(utensil => utensil.toLowerCase());
  utensils = [...new Set(utensils)]; // Use a set to elimnate duplicates, then immediately convert the set back into an array.
  utensils.sort(); // Sort the utensils in alphabetical order.
  return utensils;
}

/**
 * Renders the three Dropdowns.
 * @returns {void}
 */
function renderDropdowns() {
  const ingredientsDropdown = new Dropdown("Ingrédients", "ingredients", extractIngredientsFrom(recipes));
  ingredientsDropdown.init();

  const appliancesDropdown = new Dropdown("Appareils", "appliances", extractAppliancesFrom(recipes));
  appliancesDropdown.init();

  const utensilsDropdown = new Dropdown("Ustensiles", "utensils", extractUtensilsFrom(recipes));
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
    let userInputClean = sanitize(e.target.value);
    setUserInput(userInputClean);
    e.target.value = userInputClean; // Prevents the input field from showing illegal characters.
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