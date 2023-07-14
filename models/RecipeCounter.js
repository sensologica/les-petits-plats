export default class RecipeCounter {
  #count;

  constructor(numberOfRecipes) {
    this.#count = numberOfRecipes;
  }

  get count() {
    return this.#count;
  }

  set count(numberOfRecipes) {
    this.#count = numberOfRecipes;
  }

  render() {
    const counter = document.createElement("div");
    counter.classList.add("recipe-counter");
    counter.innerText = ( this.count === 1 ? `${this.count} recette` : `${this.count} recettes` );
    
    const toolbar = document.querySelector(".toolbar__recipe-counter");
    toolbar.innerHTML = "";
    toolbar.appendChild(counter);
  }
}