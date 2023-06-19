export default class Recipe {
  #id;
  #image;
  #name;
  #servings;
  #ingredients;
  #time;
  #description;
  #appliance;
  #utensils;

  constructor(data) {
   this.#id = data.id;
   this.#image = data.image;
   this.#name = data.name;
   this.#servings = data.servings;
   this.#ingredients = data.ingredients;
   this.#time = data.time;
   this.#description = data.description;
   this.#appliance = data.appliance;
   this.#utensils = data.utensils;
  }

  get image() {
    return `./assets/recipe-images/${this.#image}`;
  }

  get name() {
    return this.#name;
  }

  get ingredients() {
    return this.#ingredients;
  }

  get time() {
    return this.#time;
  }

  get description() {
    return this.#description;
  }

  renderCard() {
    const parent = document.createElement("article");
    parent.classList.add("recipe-card");

    const content = `
      <div class="recipe-card__image-container">
        <img src="${this.image}" alt="${this.name}" class="recipe-card__image">
        <div class="recipe-card__time-tag">${this.time}min</div>
      </div>
      <div class="recipe-card__information">
        <h2 class="recipe-card__main-title">${this.name}</h2>
        <section class="recipe-card__section">
          <h3 class="recipe-card__section-title">Recette</h3>
          <p class="recipe-card__description">${this.description}</p>
        </section>
        <section class="recipe-card__section">
          <h3 class="recipe-card__section-title">Ingrédients</h3>
          <ul class="recipe-card__list-of-ingredients"></ul>
        </section>
      </div>
    `;

    parent.innerHTML = content;

    const list = parent.querySelector(".recipe-card__list-of-ingredients");
    
    this.ingredients.forEach(ingredient => {
      const li = document.createElement("li");
      li.innerHTML = `
        <p>${ingredient.ingredient}</p>
        <p class="recipe-card__ingredient-quantity">${ingredient.quantity ? ingredient.quantity : "-"} ${ingredient.unit ? (ingredient.unit === "grammes" ? "g" : ingredient.unit) : ""}</p>
      `
      
      list.appendChild(li);
    })

    return parent;
  }
}