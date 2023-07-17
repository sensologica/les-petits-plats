// The words "render" and "erase" refer to rendering to and erasing from the DOM tree (presentation layer).
// The words "add" and "remove" refer to adding to and deleting from an array/object (data layer).

import { filterList } from "../index.js";
import { updateResults } from "../index.js";

export default class Filter {
  #text;                          // The inner text of the Filter.
  #domNode;                       // The DOM node of the Filter.
  #parentFilterList = filterList; // The Filter List the Filter belongs to.
  #linkedSelectionListItem;       // The Selection List Item the Filter represents.

  constructor(text, linkedSelectionListItem) {
    this.#text = text;
    this.#linkedSelectionListItem = linkedSelectionListItem;
  }

  get text() {
    return this.#text;
  }

  get domNode() {
    return this.#domNode;
  }

  get parentFilterList() {
    return this.#parentFilterList;
  }

  get linkedSelectionListItem() {
    return this.#linkedSelectionListItem;
  }
  
  set domNode(element) {
    this.#domNode = element;
  }

  render() {
    const filter = document.createElement("div");
    filter.classList.add("filter");
    filter.innerHTML = `${this.text}<img src="../assets/icon_btn_remove-filter.svg" alt="" class="filter__btn-remove">`;

    const filterListDom = this.parentFilterList.domNode;
    filterListDom.appendChild(filter);

    this.domNode = filter;

    const filterBtnRemove = filter.querySelector(".filter__btn-remove");
    filterBtnRemove.addEventListener("click", (e) => this.handleRemoveBtnClick(e));
  }

  erase() {
    this.domNode.remove(); // Here, `remove()` refers to the native DOM Element method, not a custom method.
  }

  addToFilterList() {
    this.parentFilterList.addFilter(this);
  }

  deleteFromFilterList() {
    this.parentFilterList.deleteFilter(this);
  }

  handleRemoveBtnClick(e) {
    const clickedFilter = e.target.parentNode;
          
    this.erase();
    this.deleteFromFilterList();
    this.linkedSelectionListItem.erase();
    this.linkedSelectionListItem.deleteFromSelectionList(clickedFilter);
    this.linkedSelectionListItem.restoreInOptionList();
    
    updateResults();
  }
}