export default class TagList {
  #tags = {
    ingredients: [],
    appliances:  [],
    utensils:    [],
  };
  #domNode = document.querySelector(".tag-list");

  get tags() {
    return this.#tags;
  }

  get domNode() {
    return this.#domNode;
  }

  set tags(tags) {
    this.#tags = tags;
  }

  addTag(tag) {
    const tagParentDropdown = tag.linkedSelectionListItem.parentDropdown.id;
    const tagValue = tag.text;
    this.tags[tagParentDropdown].push(tagValue);
    // console.log(`Added "${tagValue}" to "TagList.tags.${tagParentDropdown}".\n`, this.tags);
  }

  deleteTag(tag) {
    const tagParentDropdown = tag.linkedSelectionListItem.parentDropdown.id;
    const tagValue = tag.text;
    this.tags[tagParentDropdown] = this.tags[tagParentDropdown].filter(tag => tag !== tagValue);
    // console.log(`Removed "${tagValue}" from "TagList.tags.${tagParentDropdown}".\n`, this.tags);
  }
}