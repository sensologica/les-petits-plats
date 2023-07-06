import { OptionListItem } from "./DropdownListItem.js";

export default class Dropdown {
  #name;               // The name of the dropdown.
  #optionList = [];    // A list that holds all available options.
  #selectionList = []; // A list that holds user-selected options.

  constructor(name, optionList) {
    this.#name = name;
    this.#optionList = optionList;
  }

  get name() {
    return this.#name;
  }

  get optionList() {
    return this.#optionList;
  }

  get selectionList() {
    return this.#selectionList;
  }

  set optionList(items) {
    this.#optionList = items;
  }

  set selectionList(items) {
    this.#selectionList = items;
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
        <div class="dropdown__selection-list"></div>
        <div class="dropdown__option-list"></div>
      </div>
    `;

    dropdown.innerHTML = content;

    const toolbar = document.querySelector(".toolbar__dropdowns");
    toolbar.appendChild(dropdown);
  }

  renderOptionList(options) {
    const ul = document.createElement("ul");
    ul.classList.add("dropdown__option-list-ul");

    // Assign an index to each Option List Item. This index will be used to reinsert items into
    // their original position in the Option List when they are removed from the Selection List.
    // This eliminates the need to alphabetically sort the Option List every time an item is reinserted.
    let index = 0; 

    options.forEach(option => {
      const optionListItem = new OptionListItem(this, option, index);
      ul.appendChild(optionListItem.render());
      index++;
    })

    // Attach the newly creater Option List to its Dropdown.
    const dropdown = document.querySelector(`.${this.name}`);
    const optionList = dropdown.querySelector(".dropdown__option-list");
    optionList.innerHTML = "";
    optionList.appendChild(ul);
  }

  renderSelectionList() {
    const ul = document.createElement("ul");
    ul.classList.add("dropdown__selection-list-ul");

    const dropdown = document.querySelector(`.${this.name}`);
    const selectionList = dropdown.querySelector(".dropdown__selection-list");
    selectionList.appendChild(ul);
  }

  onSearchbarInput() {
    const dropdown = document.querySelector(`.${this.name}`);
    const searchbar = dropdown.querySelector(".dropdown__searchbar");

    searchbar.addEventListener("input", (e) => {
      const userInput = e.target.value;
      let filteredOptionList = this.optionList.filter(option => option.toLowerCase().includes(userInput.toLowerCase()));
      this.renderOptionList(filteredOptionList);
    });
  }

  onHeaderClick() {
    const dropdown = document.querySelector(`.${this.name}`);
    const header = dropdown.querySelector(".dropdown__header");
    header.addEventListener("click", () => {
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
    this.onHeaderClick();
    this.renderOptionList(this.optionList);
    this.onSearchbarInput();
  }
}