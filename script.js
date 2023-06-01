let generateButton = document.getElementById(`generateButton`)
let visualizeButton = document.getElementById(`visualizeButton`)
let subgrids = document.getElementsByClassName(`subgrid`)

let visual

let subgridSize = 3
let gridSize = subgridSize * subgridSize
let grid = []

for (let y = 0; y < gridSize; y++) {
  grid.push([])
}

generateButton.addEventListener(`click`, generate)
visualizeButton.addEventListener(`click`, visualize)

function generate() {
  visual = false
  generateGrid()
}

function visualize() {
  visual = true
  generateGrid()
}

async function generateGrid() {
  if (visual) {
    generateButton.disabled = true
    visualizeButton.disabled = true
  }

  clearGrid()
  await fillSquare(0, 0)

  if (visual) {
    generateButton.disabled = false
    visualizeButton.disabled = false
  } else {
    displayGrid()
  }
}

function clearGrid() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      grid[y][x] = null
    }
  }
}

async function fillSquare(x, y) {
  let possibleNumbers = getPossibleNumbers(x, y)
  shuffle(possibleNumbers)

  for (let number of possibleNumbers) {
    grid[y][x] = number

    if (visual) {
      displayGrid()
      await sleep()
    }

    let success

    if (x < gridSize - 1) {
      success = await fillSquare(x + 1, y)
    } else if (y < gridSize - 1) {
      success = await fillSquare(0, y + 1)
    } else {
      success = true
    }

    if (success) {
      return true
    }
  }

  grid[y][x] = null

  if (visual) {
    displayGrid()
    await sleep()
  }

  return false
}

function getPossibleNumbers(x, y) {
  let numbers = []
  let numbersInRow = getNumbersInRow(y)
  let numbersInColumn = getNumbersInColumn(x)
  let numbersInSubgrid = getNumbersInSubgrid(x, y)

  for (let number = 1; number <= gridSize; number++) {
    if (!numbersInRow[number] && !numbersInColumn[number] && !numbersInSubgrid[number]) {
      numbers.push(number)
    }
  }

  return numbers
}

function getNumbersInRow(y) {
  let numbers = []

  for (let x = 0; x < gridSize; x++) {
    let number = grid[y][x]

    if (number) {
      numbers[number] = true
    }
  }

  return numbers
}

function getNumbersInColumn(x) {
  let numbers = []

  for (let y = 0; y < gridSize; y++) {
    let number = grid[y][x]

    if (number) {
      numbers[number] = true
    }
  }

  return numbers
}

function getNumbersInSubgrid(x, y) {
  let numbers = []
  let rowIndex = Math.floor(y / subgridSize)
  let columnIndex = Math.floor(x / subgridSize)

  for (y = rowIndex * subgridSize; y < (rowIndex + 1) * subgridSize; y++) {
    for (x = columnIndex * subgridSize; x < (columnIndex + 1) * subgridSize; x++) {
      let number = grid[y][x]

      if (number) {
        numbers[number] = true
      }
    }
  }

  return numbers
}

function shuffle(array) {
  let currentIndex = array.length

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    let temp = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temp
  }
}

function displayGrid() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let rowIndex = Math.floor(y / subgridSize)
      let columnIndex = Math.floor(x / subgridSize)
      let subgridIndex = rowIndex * subgridSize + columnIndex
      let subgrid = subgrids[subgridIndex]
      let squares = subgrid.querySelectorAll(`.square`)

      rowIndex = y % subgridSize
      columnIndex = x % subgridSize
      let squareIndex = rowIndex * subgridSize + columnIndex
      let square = squares[squareIndex]
      square.innerHTML = grid[y][x]
    }
  }
}

function sleep() {
  return new Promise(resolve => setTimeout(resolve, 50))
}
