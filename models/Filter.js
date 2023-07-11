import { filterList } from "../index.js";
import { removeFilter } from "../index.js";

export default class Filter {
  #text;                    // The inner text of the Filter.
  #domNode;                 // The DOM node of the Filter.
  #parentFilterList = filterList; // The Filter List the Filter belongs to.
  #linkedSelectionListItem; // The Selection List Item the Filter represents.

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

  addToFilterListDom() {
    // Build the DOM structure for the filter. 
    const filter = document.createElement("div");
    filter.classList.add("filter");
    const filterContent = `${this.text}<img src="../assets/icon_btn_remove-filter.svg" alt="" class="filter__btn-remove">`;
    filter.innerHTML = filterContent;

    // Append the filter to the filter list.
    const filterListDom = this.parentFilterList.domNode;
    filterListDom.appendChild(filter);

    // Store the filter's DOM node as a property to facilitate future operations (e.g. removing the filter).
    this.domNode = filter;

    // Add an event listener to the filter's "remove" button.
    const filterBtnRemove = filter.querySelector(".filter__btn-remove");
    filterBtnRemove.addEventListener("click", (e) => {
      const clickedFilter = e.target.parentNode;
      
      this.removeFromFilterListDom();
      this.removeFromFilterListArray(clickedFilter);
      removeFilter(this.linkedSelectionListItem.parentDropdown.id, this.text);

      this.linkedSelectionListItem.removeFromSelectionListDom();
      this.linkedSelectionListItem.removeFromSelectionListArray(clickedFilter);

      this.linkedSelectionListItem.restoreInOptionList();
    });
  }

  addToFilterListArray() {
    this.parentFilterList.addFilter(this.text);
  }

  removeFromFilterListDom() {
    this.domNode.remove();
  }

  removeFromFilterListArray(filter) {
    this.parentFilterList.removeFilter(filter.innerText);
  }
}