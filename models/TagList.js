export default class TagList {
  #tags = []; // An array for storing Tags.
  #domNode = document.querySelector(".tag-list"); // The DOM node of the Tag List.

  get tags() {
    return this.#tags;
  }

  get domNode() {
    return this.#domNode;
  }

  set tags(tags) {
    this.#tags = tags;
  }

  addTag(clickedTag) {
    this.tags.push(clickedTag);
  }

  removeTag(clickedTag) {
    this.tags = this.tags.filter(tag => tag != clickedTag);
  }
}