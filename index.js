import { recipes }   from "./data/recipes.js";
import RecipeCard    from "./models/RecipeCard.js";
import Dropdown      from "./models/Dropdown.js"
import FilterList       from "./models/FilterList.js";
import RecipeCounter from "./models/RecipeCounter.js";

let activeFilters = {
  ingredients: [],
  appliances:  [],
  utensils:    [],
}

export function addFilter(dropdownName, selectedItem) {
  activeFilters[dropdownName].push(selectedItem);
  filterRecipes();
}

export function removeFilter(dropdownName, selectedItem) {
  activeFilters[dropdownName] = activeFilters[dropdownName].filter(item => item !== selectedItem);
  filterRecipes();
}

function filterRecipes() {
  const filteredRecipes = recipes.filter(recipe => {
    return activeFilters.ingredients.every(filter => {
      const recipeIngredientsSimplified = recipe.ingredients.map(ingredient => ingredient.ingredient);
      return recipeIngredientsSimplified.includes(filter);
    }) && activeFilters.appliances.every(filter => {
      return recipe.appliance.toLowerCase().includes(filter);
    }) && activeFilters.utensils.every(filter => {
      return recipe.utensils.includes(filter);
    });
  });
  renderRecipes(filteredRecipes);
  const recipeCounter = new RecipeCounter(filteredRecipes.length);
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
    const thisRecipe = new RecipeCard(recipe);          // Create a new Recipe Card object.
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
      renderRecipes(findMatches(userInput));
    } else if (!inputIsValid && !showingAllRecipes) {
      showingAllRecipes = true;
      renderRecipes(recipes);
    }
  });
}

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

/**
 * Establishes an explicit order of function execution.
 * @returns {void}
 */
function init() {
  renderRecipes(recipes); // Render all recipes on the page for the first time.
  listenForUserInput();   // Activate event listeners on the main searchbar.
  renderDropdowns();      // Render all dropdowns.
  renderRecipeCounter(recipes.length);  // Render the recipe counter.
}

init();