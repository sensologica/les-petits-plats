import * as error from "../utils/error.js";

/**
 * Checks if the Main Search Bar input value meets the minimum length requirements.
 * @param {string} inputValue - What the user types into the searchbar.
 * @returns {boolean}
 */
export function validate(inputValue) {
  const minLength = 3;
  if (inputValue.length < minLength) {
    error.invalidSearchQueryLength(minLength);
    if (inputValue.length === 0) {
      error.clear();
    }
    return false;
  } else {
    error.clear();
    return true;
  }
}