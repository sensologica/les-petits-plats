import { tagList } from "../index.js";

export default class Tag {
  #text;                    // The inner text of the Tag.
  #domNode;                 // The DOM node of the Tag.
  #parentTagList = tagList; // The Tag List the Tag belongs to.
  #linkedSelectionListItem; // The Selection List Item the Tag represents.

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

  get parentTagList() {
    return this.#parentTagList;
  }

  get linkedSelectionListItem() {
    return this.#linkedSelectionListItem;
  }
  
  set domNode(element) {
    this.#domNode = element;
  }

  addToTagListDom() {
    // Build the DOM structure for the tag. 
    const tag = document.createElement("div");
    tag.classList.add("tag");
    const tagContent = `${this.text}<img src="../assets/icon_btn_remove-tag.svg" alt="" class="tag__btn-remove">`;
    tag.innerHTML = tagContent;

    // Append the tag to the tag list.
    const tagListDom = this.parentTagList.domNode;
    tagListDom.appendChild(tag);

    // Store the tag's DOM node as a property to facilitate future operations (e.g. removing the tag).
    this.domNode = tag;

    // Add an event listener to the tag's "remove" button.
    const tagBtnRemove = tag.querySelector(".tag__btn-remove");
    tagBtnRemove.addEventListener("click", (e) => {
      const clickedTag = e.target.parentNode;
      
      this.removeFromTagListDom();
      this.removeFromTagListArray(clickedTag);

      this.linkedSelectionListItem.removeFromSelectionListDom();
      this.linkedSelectionListItem.removeFromSelectionListArray(clickedTag);

      this.linkedSelectionListItem.restoreInOptionList();
    });
  }

  addToTagListArray() {
    this.parentTagList.addTag(this.text);
  }

  removeFromTagListDom() {
    this.domNode.remove();
  }

  removeFromTagListArray(tag) {
    this.parentTagList.removeTag(tag.innerText);
  }
}