import { filterList } from "../index.js";

/**
 * Filters recipes based on dropdown filters set by the user.
 * @param {array} - Array of objects that represents all recipes in the database (or a subset).
 * @returns {array} - Array of filtered recipes.
 */
export function filterRecipes(recipes) {
  const filteredRecipes = recipes.filter(recipe => {
    return filterList.filters.ingredients.every(filter => {
      const recipeIngredientsSimplified = recipe.ingredients.map(ingredient => ingredient.ingredient);
      return recipeIngredientsSimplified.includes(filter);
    }) && filterList.filters.appliances.every(filter => {
      return recipe.appliance.toLowerCase().includes(filter);
    }) && filterList.filters.utensils.every(filter => {
      return recipe.utensils.includes(filter);
    });
  });

  console.log("Filter results: ", filteredRecipes);
  return filteredRecipes;
}