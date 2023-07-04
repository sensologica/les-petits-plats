export default class RecipeCounter {
  #count = 0;

  get count() {
    return this.#count;
  }

  set count(numberOfRecipes) {
    this.#count = numberOfRecipes;
  }

  render() {
    const counter = document.createElement("div");
    counter.classList.add("recipe-counter");
    counter.innerText = `${this.count} recettes`;
    
    const toolbar = document.querySelector(".toolbar__recipe-counter");
    toolbar.appendChild(counter);
  }

  update() {

  }
}