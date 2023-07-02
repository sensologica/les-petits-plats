class DropdownListItem {
  #parentDropdown; // The dropdown the list item belongs to.
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
    
      const selectsListItem = new SelectsListItem(this.parentDropdown, this.text, this.index); // Add the clicked item to the `selectsList` array. 

      this.parentDropdown.renderSelectsList(); // Render/update the selects list.
      selectsListItem.render();
      this.parentDropdown.selectsList.push(selectsListItem);       
    });

    return li;
  }
}

export class SelectsListItem extends DropdownListItem {
  render() {
    // Get the selects list of the dropdown to which this list item belongs.
    const dropdown = document.querySelector(`.${this.parentDropdown.name}`);
    const selectsList = dropdown.querySelector(".dropdown__selects-list");

    // Create a selects list item.
    const li = document.createElement("li");
    li.classList.add("dropdown__selects-list-li");
    li.innerText = this.text;

    // Create a "remove" button and attach it to the selects list item.
    const btnRemove = document.createElement("button");
    btnRemove.classList.add("dropdown__selects-list-li-btn-remove");
    li.appendChild(btnRemove);

    // Add event listeners to the "remove" button.
    btnRemove.addEventListener("click", (e) => {
      const clickedItem = e.target.parentNode;
      this.removeFromDOM(clickedItem);
      this.removeFromSelectsListArray(clickedItem);
      this.removeFromTagsList(clickedItem);
      this.restoreInOptionsList();
    });

    // Append the list item to the selects list.
    selectsList.appendChild(li);

    this.renderTag();
  }

  removeFromDOM(item) {
    item.remove();
  }

  removeFromSelectsListArray(item) {
    const clickedItemText = item.innerText;
    this.parentDropdown.selectsList = this.parentDropdown.selectsList.filter(item => item.text !== clickedItemText);    
  }

  removeFromTagsList(item) {
    const clickedItemText = item.innerText;
    const tagsContainer = document.querySelector(".tags-container");
    
    // TODO Need to escape whitespaces, otherwise the query selector fails on multi-word items.
    const itemToRemove = tagsContainer.querySelector(`[data-id=${clickedItemText}]`);
    itemToRemove.remove();
  }

  restoreInOptionsList() {
    this.parentDropdown.optionsList.splice(this.index, 0, this.text); // Holding onto the index throughout these operations allows us to easily place the item back where it was without having to do any kind of performance-costly operations on the array.
    this.parentDropdown.renderOptionsList(this.parentDropdown.optionsList);
  }

  renderTag() {
    const tagsContainer = document.querySelector(".tags-container");

    // Build tag element
    const tag = document.createElement("div");
    tag.classList.add("tag");

    // TODO Need to escape whitespaces, otherwise the query selector fails on multi-word items.
    tag.setAttribute("data-id", this.text);

    const tagContent = `${this.text}<img src="../assets/icon_btn_remove-tag.svg" alt="" class="tag__btn-remove">`;
    tag.innerHTML = tagContent;

    tagsContainer.appendChild(tag);

    // Add event listeners to the tag's "remove" button.
    const tagBtnRemove = tag.querySelector(".tag__btn-remove");
    tagBtnRemove.addEventListener("click", (e) => {
      const clickedItem = e.target.parentNode;
      this.removeFromDOM(clickedItem);
      // this.tagRemoveSelectsListItem(e);
    });
  }

  tagRemoveSelectsListItem(e) {
    const clickedItemText = e.target.parentNode.innerText;
    const selectsList = this.parentDropdown.selectsList;
    const itemToRemove = selectsList.filter(item => item.text === clickedItemText);
    // this.remove(itemToRemove);
  }
}