/** 
 * Finds an intersection of two arrays.
 * @param {array} arr1 - The first array.
 * @param {array} arr2 - The second array.
 * @returns {array} - The intersection of `arr1` and `arr2`.
 */

export function intersect(arr1, arr2) {
  // Account for the possibility that either array might not exist (if the user didn't search or filter).
  if (arr1 === undefined) {
    return arr2;
  }

  if (arr2 === undefined) {
    return arr1;
  }

  // Find the intersection.
  const intersectionResults = arr1.filter(element => arr2.includes(element));
  console.log("Intersection results: ", intersectionResults);

  return intersectionResults;
}