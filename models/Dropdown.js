import { OptionsListItem, SelectsListItem } from "./DropdownListItem.js";

export default class Dropdown {
  #name;
  #optionsList = [];
  #selectsList = [];
  #isOpen = false;

  constructor(name, optionsList) {
    this.#name = name;
    this.#optionsList = optionsList;
  }

  get name() {
    return this.#name;
  }

  get optionsList() {
    return this.#optionsList;
  }

  get selectsList() {
    return this.#selectsList;
  }

  get isOpen() {
    return this.#isOpen;
  }

  set selectsList(items) {
    this.#selectsList = items;
  }

  render() {
    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");

    const content = `
      <div class="dropdown__header">
        <p>${this.name}</p>
        <img src="./assets/disclosure-triangle.svg" alt="" class="dropdown__disclosure-triangle">
      </div>
      <div class="dropdown__searchbar">
        <input type="search" class="dropdown__searchbar-input">
        <img src="./assets/icon_search_gray.svg" alt="" class="dropdown__searchbar-icon">
      </div>
      <div class="dropdown__selects-list" data-id="selects-${this.name}"></div>
      <div class="dropdown__options-list" data-id="options-${this.name}"></div>
    `;

    dropdown.innerHTML = content;

    // Attach the dropdown to the toolbar
    const toolbar = document.querySelector(".toolbar");
    toolbar.appendChild(dropdown);
  }

  renderOptionsList(options) {
    const ul = document.createElement("ul");
    ul.classList.add("dropdown__options-list-ul");

    let index = 0; // Assign an index to each options list item so that it can be used later to reinsert items from the selects list.

    options.forEach(item => {
      const optionsListItem = new OptionsListItem(this, item, index);
      ul.appendChild(optionsListItem.render());
      index++;
    })

    // Attach the options list to the dropdown
    const optionsListWrapper = document.querySelector(`[data-id=options-${this.name}]`);
    optionsListWrapper.innerHTML = "";
    optionsListWrapper.appendChild(ul);
  }

  renderSelectsList() {
    const ul = document.createElement("ul");
    ul.classList.add("dropdown__selects-list-ul");

    this.selectsList.forEach(item => {
      ul.appendChild(item.render());
    });

    const selectsListWrapper = document.querySelector(`[data-id=selects-${this.name}]`);
    selectsListWrapper.innerHTML = "";
    selectsListWrapper.appendChild(ul); 
  }

  open() {
  }

  close() {
  }

  onOptionsListFilter() {
    const searchbar = document.querySelector(".dropdown__searchbar-input");

    searchbar.addEventListener("input", (e) => {
      const userInput = e.target.value;

      let filteredOptionsList = this.optionsList.filter(item => item.toLowerCase().includes(userInput.toLowerCase()));
      this.renderOptionsList(filteredOptionsList);
    });
  }

  init() {
    this.render();
    this.renderOptionsList(this.optionsList);
    this.onOptionsListFilter();
  }
}