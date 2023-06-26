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
      <div class="dropdown__selects-list"></div>
      <div class="dropdown__options-list"></div>
    `;

    dropdown.innerHTML = content;

    // Attach the dropdown to the toolbar
    const toolbar = document.querySelector(".toolbar");
    toolbar.appendChild(dropdown);
  }

  renderOptionsList(items) {
    const ul = document.createElement("ul");
    ul.classList.add("dropdown__options-list-ul");

    items.forEach(item => {
      const li = document.createElement("li");
      li.classList.add("dropdown__options-list-li");
      li.innerText = item;
      ul.appendChild(li);
    })

    // Attach the options list to the dropdown
    const dropdownItems = document.querySelector(".dropdown__options-list");
    dropdownItems.innerHTML = "";
    dropdownItems.appendChild(ul);
  }

  /**
   * Visually hides clicked item from the main list.
   */
  removeOptionsListItem(item) {
    item.classList.add("visually-hidden");
  }

  restoreOptionsListItem(item) {
    item.classList.remove("visually-hidden");
  }

  onOptionsListItemClick() {
    // Select all items from the main list
    const optionListItems = document.querySelectorAll(".dropdown__options-list-li");
    
    // Add an event listener to each of these items
    optionListItems.forEach(item => item.addEventListener("click", (e) => {
      // Identify the clicked item and hold it in memory
      const clickedItem = e.target;

      // When we add an item to selects, this item should simultaneously be removed from the main list.
      // This will allow us to not have to verify the uniqueness of the selects, which helps performance
      // as well as avoiding duplicates.

      // Visually hide the item from the UI. The item will remain in the DOM. This is needed so that the item
      // can be conveniently put back into the main list when removed from the selects list.
      // The alternative `clickedItem.remove()` was considered but it might be less performant because it
      // requires DOM tree traversal, it also permanently removes the item from the DOM which would make placing 
      // it back very difficult. It would disturb alphabetical sorting and would not be good for performance.
      // clickedItem.classList.add("visually-hidden");
      this.removeOptionsListItem(clickedItem);

      this.selectsList.push(clickedItem.innerText); // Add item to selection
      this.renderSelectsList();
    }));
  }

  renderSelectsList () {
    const selectsListWrapper = document.querySelector(".dropdown__selects-list");
    selectsListWrapper.innerHTML = "";

    const ul = document.createElement("ul");
    ul.classList.add("dropdown__selects-list-ul");

    this.selectsList.forEach(item => {
      // Create a selects list item and populate it with text
      const li = document.createElement("li");
      li.classList.add("dropdown__selects-list-li");
      li.innerText = item;

      // Create a close button and attach it to the selects list item
      const btnClose = document.createElement("button");
      btnClose.classList.add("dropdown__selects-list-li-btn-close");
      li.appendChild(btnClose);

      // Add event listeners to the close button
      btnClose.addEventListener("click", (e) => {
        const clickedItem = e.target;
        const clickedItemValue = e.target.parentNode.innerText;

        // Remove the clicked selects list item from the DOM tree
        clickedItem.parentNode.remove();

        // Remove the clicked selects list item from the `selectsList` array
        this.selectsList = this.selectsList.filter(item => item != clickedItemValue);

        // Restore the options list item that matches the clicked selects list item
        const hiddenItems = document.querySelectorAll(".visually-hidden");
        hiddenItems.forEach(item => {
          if (item.innerText === clickedItemValue) {
            item.classList.remove("visually-hidden");
          }
        });
      });

      ul.appendChild(li);
    });
    
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

      const filteredOptionsList = this.optionsList.filter(item => item.toLowerCase().includes(userInput.toLowerCase()));
      this.renderOptionsList(filteredOptionsList);
      this.onOptionsListItemClick();
    });
  }

  init() {
    this.render();
    this.renderOptionsList(this.optionsList);
    this.onOptionsListFilter();
    this.onOptionsListItemClick();
  }
}