import { tagList } from "../index.js";

/**
 * Filters recipes based on dropdown filters set by the user.
 * @param {array} - Array of objects that represents all recipes in the database (or a subset).
 * @returns {array} - Array of filtered recipes.
 */
export function filterRecipes(recipes) {
  const filteredRecipes = recipes.filter(recipe => {
    return tagList.tags.ingredients.every(tag => {
      const recipeIngredientsSimplified = recipe.ingredients.map(ingredient => ingredient.ingredient);
      return recipeIngredientsSimplified.includes(tag);
    }) && tagList.tags.appliances.every(tag => {
      return recipe.appliance.toLowerCase().includes(tag);
    }) && tagList.tags.utensils.every(tag => {
      return recipe.utensils.includes(tag);
    });
  });

  // console.log("Filter results: ", filteredRecipes);
  return filteredRecipes;
}