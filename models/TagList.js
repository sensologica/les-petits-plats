export default class TagList {
  #tags = [];

  constructor() {
  }

  get tags() {
    return this.#tags;
  }

  set tags(arrayOfTags) {
    this.#tags = arrayOfTags;
  }
}