import { OptionsListItem, SelectsListItem } from "./DropdownListItem.js";

export default class Dropdown {
  #name;             // The name of the dropdown.
  #optionsList = []; // A list that holds all the available options for a user to choose from.
  #selectsList = []; // A list that holds all the options a user has chosen.
  #isOpen = false;   // Represents the state of the dropdown (open or collapsed).

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
    dropdown.classList.add(`${this.name}`);

    const content = `
      <div class="dropdown__header">
        <p>${this.name}</p>
        <img src="./assets/disclosure-triangle.svg" alt="" class="dropdown__disclosure-triangle">
      </div>
      <div class="dropdown__main">
        <div class="dropdown__searchbar">
          <input type="search" class="dropdown__searchbar-input">
          <img src="./assets/icon_search_gray.svg" alt="" class="dropdown__searchbar-icon">
        </div>
        <div class="dropdown__selects-list"></div>
        <div class="dropdown__options-list"></div>
      </div>
    `;

    dropdown.innerHTML = content;

    // Attach the dropdown to the toolbar.
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

    // Attach the options list to the dropdown.
    const dropdown = document.querySelector(`.${this.name}`);
    const optionsListWrapper = dropdown.querySelector(".dropdown__options-list");
    optionsListWrapper.innerHTML = "";
    optionsListWrapper.appendChild(ul);
  }

  renderSelectsList() {
    const ul = document.createElement("ul");
    ul.classList.add("dropdown__selects-list-ul");

    this.selectsList.forEach(item => {
      ul.appendChild(item.render());
    });

    const dropdown = document.querySelector(`.${this.name}`);
    const selectsListWrapper = dropdown.querySelector(".dropdown__selects-list");
    selectsListWrapper.innerHTML = "";
    selectsListWrapper.appendChild(ul); 
  }

  /**
   * Listens for and handles user input on the dropdowns' searchbars.
   * @returns {void}
   */
  onOptionsListFilter() {
    const dropdown = document.querySelector(`.${this.name}`);
    const searchbar = dropdown.querySelector(".dropdown__searchbar");

    searchbar.addEventListener("input", (e) => {
      const userInput = e.target.value;

      let filteredOptionsList = this.optionsList.filter(item => item.toLowerCase().includes(userInput.toLowerCase()));
      this.renderOptionsList(filteredOptionsList);
    });
  }

  onDropdownHeaderClick() {
    const dropdown = document.querySelector(`.${this.name}`);
    const dropdownHeader = dropdown.querySelector(".dropdown__header");
    dropdownHeader.addEventListener("click", () => {
      this.open();
    });
  }

  open() {
    const dropdown = document.querySelector(`.${this.name}`);
    const dropdownMain = dropdown.querySelector(".dropdown__main");
    dropdownMain.classList.toggle("open");
    
    const disclosureTriangle = dropdown.querySelector(".dropdown__disclosure-triangle");
    disclosureTriangle.classList.toggle("open");
  }

  init() {
    this.render();
    this.onDropdownHeaderClick();
    this.renderOptionsList(this.optionsList);
    this.onOptionsListFilter();
  }
}