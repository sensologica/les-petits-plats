const errorMessageDOM = document.querySelector(".error-message");

export function noMatchingRecipes(userInput) {
  errorMessageDOM.innerText = `Aucune recette ne contient "${userInput}". Vous pouvez chercher "tarte aux pommes", "poisson", etc.`;
}

export function invalidSearchQueryLength(minLength) {
  errorMessageDOM.innerText = `Le texte de recherche doit contenir au moins ${minLength} caractères.`;
}

export function clear() {
  errorMessageDOM.innerHTML = "";
}