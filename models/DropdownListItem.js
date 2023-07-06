import Tag from "./Tag.js";

class DropdownListItem {
  #parentDropdown; // The Dropdown the List Item belongs to.
  #text;           // The text inside the List Item.
  #index;          // Used to re-insert the Item into its original position in its Option List.
  #domNode;        // The DOM node of the List Item.

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

    return li;
  }

  handleClick(e) {
    // Remove the clicked Option List Item from the DOM and remove it from the Option List array.
    const clickedItem = e.target;
    clickedItem.remove();
    this.parentDropdown.optionList = this.parentDropdown.optionList.filter(option => option !== clickedItem.innerText);

    // Create a new Selection List Item, render it to the DOM, and push it into the Selection List array.
    const selectionListItem = new SelectionListItem(this.parentDropdown, this.text, this.index);
    selectionListItem.render();
    this.parentDropdown.selectionList.push(selectionListItem);

    const clickedItemText = e.target.innerText; // Get the clicked item's inner text.
    const tag = new Tag(clickedItemText, selectionListItem);
    selectionListItem.linkedTag = tag;
    tag.addToTagListDom();
    tag.addToTagListArray();
  }
}

export class SelectionListItem extends DropdownListItem {
  #linkedTag;

  get linkedTag() {
    return this.#linkedTag;
  }

  set linkedTag(tag) {
    this.#linkedTag = tag;
  }

  render() {
    // Get the selection list of the dropdown to which this list item belongs.
    const dropdown = document.querySelector(`.${this.parentDropdown.name}`);
    const selectionList = dropdown.querySelector(".dropdown__selection-list");

    // Create a selection list item.
    const li = document.createElement("li");
    li.classList.add("dropdown__selection-list-li");
    li.innerText = this.text;

    // Create a "remove" button and attach it to the selection list item.
    const btnRemove = document.createElement("button");
    btnRemove.classList.add("dropdown__selection-list-li-btn-remove");
    li.appendChild(btnRemove);

    // Store the list item's DOM node as a property to facilitate future operations (e.g. removing the list item).
    this.domNode = li;

    // Add event listeners to the "remove" button.
    btnRemove.addEventListener("click", (e) => {
      const clickedItem = e.target.parentNode;

      this.removeFromSelectionListDom();
      this.removeFromSelectionListArray(clickedItem);

      this.restoreInOptionList();

      this.linkedTag.removeFromTagListDom();
      this.linkedTag.removeFromTagListArray(clickedItem);      
    });

    // Append the list item to the selection list.
    selectionList.appendChild(li);
  }

  removeFromSelectionListDom() {
    this.domNode.remove();
  }

  removeFromSelectionListArray(item) {
    const clickedItemText = item.innerText;
    this.parentDropdown.selectionList = this.parentDropdown.selectionList.filter(item => item.text !== clickedItemText);    
  }

  restoreInOptionList() {
    this.parentDropdown.optionList.splice(this.index, 0, this.text); // Holding onto the index throughout these operations allows us to easily place the item back where it was without having to do any kind of performance-costly operations on the array.
    this.parentDropdown.renderOptionList(this.parentDropdown.optionList);
  }
}