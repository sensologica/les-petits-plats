import { filterRecipes } from "../index.js";

export default class FilterList {
  #filters = {
    ingredients: [],
    appliances:  [],
    utensils:    [],
  };
  #domNode = document.querySelector(".filter-list");

  get filters() {
    return this.#filters;
  }

  get domNode() {
    return this.#domNode;
  }

  set filters(filters) {
    this.#filters = filters;
  }

  addFilter(filter) {
    const filterParentDropdown = filter.linkedSelectionListItem.parentDropdown.id;
    const filterValue = filter.text;
    this.filters[filterParentDropdown].push(filterValue);
    // console.log(`Added "${filterValue}" to "FilterList.filters.${filterParentDropdown}".\n`, this.filters);
    filterRecipes();
  }

  deleteFilter(filter) {
    const filterParentDropdown = filter.linkedSelectionListItem.parentDropdown.id;
    const filterValue = filter.text;
    this.filters[filterParentDropdown] = this.filters[filterParentDropdown].filter(filter => filter !== filterValue);
    // console.log(`Removed "${filterValue}" from "FilterList.filters.${filterParentDropdown}".\n`, this.filters);
    filterRecipes();
  }
}