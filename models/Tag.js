// The words "render" and "erase" refer to rendering to and erasing from the DOM tree (presentation layer).
// The words "add" and "remove" refer to adding to and deleting from an array/object (data layer).

import { tagList } from "../index.js";
import { updateResults } from "../index.js";

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

  render() {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.innerHTML = `${this.text}<img src="../assets/icon_btn_remove-tag.svg" alt="" class="tag__btn-remove">`;

    const tagListDom = this.parentTagList.domNode;
    tagListDom.appendChild(tag);

    this.domNode = tag;

    const tagBtnRemove = tag.querySelector(".tag__btn-remove");
    tagBtnRemove.addEventListener("click", (e) => this.handleRemoveBtnClick(e));
  }

  erase() {
    this.domNode.remove(); // Here, `remove()` refers to the native DOM Element method, not a custom method.
  }

  addToTagList() {
    this.parentTagList.addTag(this);
  }

  deleteFromTagList() {
    this.parentTagList.deleteTag(this);
  }

  handleRemoveBtnClick(e) {
    const clickedTag = e.target.parentNode;
          
    this.erase();
    this.deleteFromTagList();
    this.linkedSelectionListItem.erase();
    this.linkedSelectionListItem.deleteFromSelectionList(clickedTag);
    this.linkedSelectionListItem.restoreInOptionList();
    
    updateResults();
  }
}