class DropdownListItem {
  #parentDropdown; // The dropdown the list and the list items belong to.
  #text;           // The text inside the list item.
  #index;          // Used as an index to re-insert an item in its previous location without having to redo alphabetical sorting on the entire list. More information below where the index is used.

  constructor(parentDropdown, text, index) {
    this.#parentDropdown = parentDropdown;
    this.#text = text;
    this.#index = index;
  }

  get parentDropdown() {
    return this.#parentDropdown;
  }

  get text() {
    return this.#text;
  }

  get index() {
    return this.#index;
  }
}

export class OptionsListItem extends DropdownListItem {
  render() {
    const li = document.createElement("li");
    li.classList.add("dropdown__options-list-li");
    li.innerText = this.text;

    li.addEventListener("click", (e) => {
      const clickedItem = e.target; // Grab the clicked item's DOM node.
      clickedItem.remove(); // Remove the clicked item's DOM node from the DOM tree.
      this.parentDropdown.optionsList.splice(this.index, 1); // Use the clicked item's index to remove it from the `optionsList` array without having to run a search on the entire array.
      // Now the DOM (presentation layer) and the `optionsList` array (data layer) are in sync: the item is removed visually from the UI, but also from the `optionsList` array.
    
      this.parentDropdown.selectsList.push(new SelectsListItem(this.parentDropdown, this.text, this.index)); // Add the clicked item to the `selectsList` array. 
      this.parentDropdown.renderSelectsList(); // Render/update the selects list.
    });

    return li;
  }
}

export class SelectsListItem extends DropdownListItem {
  render() {
    const li = document.createElement("li");
    li.classList.add("dropdown__selects-list-li");
    li.innerText = this.text;

    // Create a "remove" button and attach it to the selects list item.
    const btnRemove = document.createElement("button");
    btnRemove.classList.add("dropdown__selects-list-li-btn-remove");
    li.appendChild(btnRemove);

    // Add event listeners to the "remove" button.
    btnRemove.addEventListener("click", (e) => {
      const clickedItem = e.target;
      const clickedItemText = e.target.parentNode.innerText;

      // Remove the clicked selects list item from the DOM tree.
      clickedItem.parentNode.remove();

      // Remove the clicked selects list item from the `selectsList` array.
      this.parentDropdown.selectsList = this.parentDropdown.selectsList.filter(item => item.text !== clickedItemText);

      // Restore the options list item that matches the clicked selects list item.
      this.parentDropdown.optionsList.splice(this.index, 0, this.text); // Holding onto the index throughout these operations allows us to easily place the item back where it was without having to do any kind of performance-costly operations on the array.
      this.parentDropdown.renderOptionsList(this.parentDropdown.optionsList);
    });

    return li;
  }
}