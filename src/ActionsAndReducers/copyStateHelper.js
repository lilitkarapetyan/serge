export default function deepCopy(objectpassed) {

  if (objectpassed === null || typeof objectpassed !== 'object') {
    return objectpassed;
  }

  var temporaryStorage = objectpassed.constructor();

  for (var key in objectpassed) {
    temporaryStorage[key] = deepCopy((objectpassed[key]));
  }
  return temporaryStorage;
}