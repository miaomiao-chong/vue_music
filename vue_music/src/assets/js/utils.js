export function shuffle(source) {
  console.log("--------------source----------------", source)
  const arr = source.slice()
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = getRandomInt(i);
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function getRandomInt(max) {
  // [0,max]
  return Math.floor(Math.random() * (max + 1))
}
