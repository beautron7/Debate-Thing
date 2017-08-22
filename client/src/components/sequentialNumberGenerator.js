export function* sequentialNumberGenerator() {
  var i = 0
  while (true){
    yield i;
    i++
  }
}
