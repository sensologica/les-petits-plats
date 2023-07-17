import Filter from "./Filter.js";
import { updateResults } from "../index.js";

class DropdownListItem {
  #parentDropdown; // The Dropdown the List Item belongs to.
  #text;           // The text inside the List Item.
  #domNode;        // The DOM node of the List Item.

  constructor(parentDropdown, text) {
    this.#parentDropdown = parentDropdown;
    this.#text = text;
  }

  get parentDropdown() {
    return this.#parentDropdown;
  }

  get text() {
    return this.#text;
  }

  get domNode() {
    return this.#domNode;
  }

  set domNode(element) {
    this.#domNode = element;
  }
}

export class OptionListItem extends DropdownListItem {
  render() {
    const li = document.createElement("li");
    li.classList.add("dropdown__option-list-li");
    li.innerText = this.text;
    li.addEventListener("click", (e) => this.handleClick(e));

    this.domNode = li; // Store the list item's DOM node as a property to facilitate future operations (e.g. removing the list item).

    return li;
  }

  erase() {
    this.domNode.remove();
  }

  deleteFromOptionList() {
    this.parentDropdown.optionList = this.parentDropdown.optionList.filter(option => option !== this.text);
  }

  handleClick(e) {
    this.erase();
    this.deleteFromOptionList();

    // Create a new Selection List Item, render it to the DOM, and push it into the Selection List array.
    const selectionListItem = new SelectionListItem(this.parentDropdown, this.text);
    selectionListItem.render();
    this.parentDropdown.selectionList.push(selectionListItem);

    // Create a new Filter, render it to the DOM, and push it into the Filter List array.
    const clickedItemText = e.target.innerText;
    const filter = new Filter(clickedItemText, selectionListItem);
    selectionListItem.linkedFilter = filter;
    filter.render();
    filter.addToFilterList();

    // Clear the Dropdown's Search Bar.
    const dropdown = document.querySelector(`.${this.parentDropdown.name}`);
    const searchbar = dropdown.querySelector(".dropdown__searchbar-input");
    if (searchbar.value) { searchbar.value = ""; };
    this.parentDropdown.optionList.sort();
    this.parentDropdown.renderOptionList(this.parentDropdown.optionList);

    updateResults();
  }
}

export class SelectionListItem extends DropdownListItem {
  #linkedFilter;

  get linkedFilter() {
    return this.#linkedFilter;
  }

  set linkedFilter(filter) {
    this.#linkedFilter = filter;
  }

  render() {
    const dropdown = document.querySelector(`.${this.parentDropdown.name}`);
    const selectionList = dropdown.querySelector(".dropdown__selection-list");

    const li = document.createElement("li");
    li.classList.add("dropdown__selection-list-li");
    li.innerText = this.text;

    const btnRemove = document.createElement("button");
    btnRemove.classList.add("dropdown__selection-list-li-btn-remove");
    li.appendChild(btnRemove);

    this.domNode = li; // Store the list item's DOM node as a property to facilitate future operations (e.g. removing the list item).

    btnRemove.addEventListener("click", (e) => this.handleRemoveBtnClick(e));
    selectionList.appendChild(li);
  }

  erase() {
    this.domNode.remove();
  }

  deleteFromSelectionList(item) {
    const clickedItemText = item.innerText;
    this.parentDropdown.selectionList = this.parentDropdown.selectionList.filter(item => item.text !== clickedItemText);    
  }

  restoreInOptionList() {
    this.parentDropdown.optionList.push(this.text);
    this.parentDropdown.optionList.sort();
    this.parentDropdown.renderOptionList(this.parentDropdown.optionList);
  }

  handleRemoveBtnClick(e) {
    const clickedItem = e.target.parentNode;

    this.erase();
    this.deleteFromSelectionList(clickedItem);
    this.restoreInOptionList();
    this.linkedFilter.erase();
    this.linkedFilter.deleteFromFilterList();

    updateResults();
  }
}