import { OptionListItem } from "./DropdownListItem.js";

export default class Dropdown {
  #name;               // The name of the dropdown.
  #id;                 // The unique ID of the dropdown.
  #optionList = [];    // A list that holds all available options.
  #selectionList = []; // A list that holds user-selected options.
  #searchbarInput;     // The DOM node of this Dropdown's Search Bar.

  constructor(name, id, optionList) {
    this.#name = name;
    this.#id = id;
    this.#optionList = optionList;
  }

  get name() {
    return this.#name;
  }

  get id() {
    return this.#id;
  }

  get optionList() {
    return this.#optionList;
  }

  get selectionList() {
    return this.#selectionList;
  }

  get searchbarInput() {
    return this.#searchbarInput;
  }

  set optionList(items) {
    this.#optionList = items;
  }

  set selectionList(items) {
    this.#selectionList = items;
  }

  set searchbarInput(element) {
    this.#searchbarInput = element;
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

    const searchbarInput = dropdown.querySelector(".dropdown__searchbar-input");
    this.searchbarInput = searchbarInput;

    const toolbar = document.querySelector(".toolbar__dropdowns");
    toolbar.appendChild(dropdown);
  }

  renderOptionList(options) {
    const ul = document.createElement("ul");
    ul.classList.add("dropdown__option-list-ul");

    options.forEach(option => {
      const optionListItem = new OptionListItem(this, option);
      ul.appendChild(optionListItem.render());
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

    this.searchbarInput.focus();
  }

  init() {
    this.render();
    this.onHeaderClick();
    this.renderOptionList(this.optionList);
    this.onSearchbarInput();
  }
}