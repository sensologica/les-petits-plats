class DropdownListItem {
  #dropdown;
  #text;
  #index;

  constructor(dropdown, text, index) {
    this.#dropdown = dropdown;
    this.#text = text;
    this.#index = index;
  }

  get dropdown() {
    return this.#dropdown;
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
      const clickedItem = e.target; // Identify the clicked item (DOM node).
      clickedItem.remove(); // Remove the clicked item (DOM node) from the DOM tree.

      this.dropdown.optionsList.splice(this.index, 1); // Use the clicked item's index to remove it from the `optionsList` array.
      // Now the DOM (presentation layer) and the `optionsList` array (data layer) are in sync: the item is removed visually
      // from the UI, but also from the `optionsList` array.
    
      this.dropdown.selectsList.push(new SelectsListItem(this.dropdown, this.text, this.index)); // Add the clicked item to the `selectsList`. 
      this.dropdown.renderSelectsList();
    });

    return li;
  }
}

export class SelectsListItem extends DropdownListItem {
  render() {
    const li = document.createElement("li");
    li.classList.add("dropdown__selects-list-li");
    li.innerText = this.text;

    // Create a remove button and attach it to the selects list item.
    const btnRemove = document.createElement("button");
    btnRemove.classList.add("dropdown__selects-list-li-btn-remove");
    li.appendChild(btnRemove);

    // Add event listeners to the remove button.
    btnRemove.addEventListener("click", (e) => {
      const clickedItem = e.target;
      const clickedItemText = e.target.parentNode.innerText;

      // Remove the clicked selects list item from the DOM tree.
      clickedItem.parentNode.remove();

      // Remove the clicked selects list item from the `selectsList` array.
      this.dropdown.selectsList = this.dropdown.selectsList.filter(item => item.text !== clickedItemText);

      // Restore the options list item that matches the clicked selects list item.
      this.dropdown.optionsList.splice(this.index, 0, this.text);
      this.dropdown.renderOptionsList(this.dropdown.optionsList);
    });

    return li;
  }
}