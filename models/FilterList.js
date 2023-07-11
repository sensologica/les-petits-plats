export default class FilterList {
  #filters = []; // An array for storing Filters.
  #domNode = document.querySelector(".filter-list"); // The DOM node of the Filter List.

  get filters() {
    return this.#filters;
  }

  get domNode() {
    return this.#domNode;
  }

  set filters(filters) {
    this.#filters = filters;
  }

  addFilter(clickedFilter) {
    this.filters.push(clickedFilter);
  }

  removeFilter(clickedFilter) {
    this.filters = this.filters.filter(filter => filter != clickedFilter);
  }
}