const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
}

const blockSize = 40

let score = 0
let lastDirection = DIRECTION.DOWN
let foodX
let foodY

function resetFood() {
  let random_x = Math.floor(Math.random() * canvas.width)
  let random_y = Math.floor(Math.random() * canvas.height)

  // If food would end up outside of canvas
  if (random_x < blockSize / 2) {
    foodX = blockSize
  } else if (random_x > (canvas.width - blockSize / 2)) {
    foodX = canvas.width - blockSize / 2
  } else {
    foodX = random_x
  }
  if (random_y > (canvas.height - blockSize / 2)) {
    foodY = canvas.height - blockSize / 2
  } else if (random_y < blockSize / 2) {
    foodY = blockSize
  } else {
    foodY = random_y
  }
}

function drawFood(x, y) {
  ctx.beginPath()
  ctx.rect(x, y, blockSize, blockSize)
  ctx.fillStyle = '#FF3530'
  ctx.fill()
  ctx.closePath()
}

let snakeX = 100
let snakeY = 100

const snakehoms = [
  { x: snakeX, y: snakeY },
  { x: snakeX, y: snakeY - blockSize }
]

let dead = false

function drawSnake() {
  snakehoms.forEach(snakepala => {
    ctx.beginPath()
    ctx.rect(snakepala.x, snakepala.y, blockSize, blockSize)
    ctx.fillStyle = '#cd278c'
    ctx.fill()
    ctx.closePath()
  })
}

function draw() {
  if (dead) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    return endGame()
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  moveSnake()
  drawSnake()
  drawFood(foodX, foodY)
  megaWin()
}

function moveSnake() {
  snakehoms.shift()
  const last = getLastArrayElement(snakehoms)

  if (lastDirection === DIRECTION.RIGHT) {
    snakehoms.push({ x: last.x + blockSize, y: last.y })
  } else if (lastDirection === DIRECTION.UP) {
    snakehoms.push({ x: last.x, y: last.y - blockSize })
  } else if (lastDirection === DIRECTION.LEFT) {
    snakehoms.push({ x: last.x - blockSize, y: last.y })
  } else if (lastDirection === DIRECTION.DOWN) {
    snakehoms.push({ x: last.x, y: last.y + blockSize })
  }

  if (last.x < blockSize / 2 || last.x > canvas.width - blockSize / 2 || last.y < blockSize / 2 || last.y > canvas.height - blockSize / 2) {
    dead = true
  }
}

function getLastArrayElement(arr) {
  return arr[arr.length - 1]
}

function megaWin() {
  let head = getLastArrayElement(snakehoms)
  if ((foodX >= head.x - blockSize / 2 && foodX <= head.x + blockSize / 2) && (foodY >= head.y - blockSize / 2 && foodY <= head.y + blockSize / 2)) {
    resetFood()
    incrementSnake()
    score++
  }
}

function incrementSnake() {
  let head = getLastArrayElement(snakehoms)
  snakehoms.unshift(head)
}

function keyDownHandler(event) {
  if (event.keyCode === 39) {
    lastDirection = DIRECTION.RIGHT
  } else if (event.keyCode === 37) {
    lastDirection = DIRECTION.LEFT
  } else if (event.keyCode === 38) {
    lastDirection = DIRECTION.UP
  } else if (event.keyCode === 40) {
    lastDirection = DIRECTION.DOWN
  }
}

function endGame() {
  ctx.font = '60px Comic Sans'
  ctx.fillText(`Kuolit, score: ${score}`, 100, 100)
  clearInterval(timer)
}

document.addEventListener('keydown', keyDownHandler, false)

resetFood()
const timer = setInterval(draw, 250)
