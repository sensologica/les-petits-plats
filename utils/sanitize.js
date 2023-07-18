export function sanitize(input) {
  const regex = /[<>(){}?!'"`_.:;$#&@*+-=]/g;
  const inputClean = input.replace(regex, ""); 
  return inputClean;
}