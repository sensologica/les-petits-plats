export default class Tag {
  #text;
  #tagList;
  #linkedSelectsListItem;

  constructor() {

  }

  get text() {
    return this.#text;
  }

  get tagList() {
    return this.#tagList;
  }

  set tagList(tagList) {
    this.#tagList = tagList;
  }

  set linkedSelectsListItem(item) {
    this.#linkedSelectsListItem = item;
  }

  render() {

  }

  remove() {
    
  }
}