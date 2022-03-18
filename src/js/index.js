const { isTouchDevice } = require('./utils/isTouchDevice')

// consts
const headTop = document.querySelector('.top')
const pupils = Array.from(headTop.querySelectorAll('.pupil'))

// state
let intervalId = null

// functions
function getDampenedValue(value) {
  const isNegative = value < 0
  const dampenedValue = Math.sqrt(Math.abs(value)) * 0.08

  return isNegative ? dampenedValue * -1 : dampenedValue
}

function randomMovement() {
  intervalId = setInterval(() => {
    const topValue = Math.random() * 4 - 2
    const leftValue = Math.random() * 4 - 2
    const transitionDuration = Math.random() * 4000

    pupils.forEach((pupil) => {
      pupil.style.top = `${topValue}rem`
      pupil.style.left = `${leftValue}rem`
      pupil.style.transition = `${transitionDuration}ms`
    })
  }, 4000)
}

function clearRandomMovement() {
  clearInterval(intervalId)

  pupils.forEach((pupil) => {
    pupil.style.transition = '100ms'
  })
}

function handleMouseMovement(event) {
  const { clientX, clientY } = event
  const { top, left, width, height } = headTop.getBoundingClientRect()

  const mouse = {
    x: clientX,
    y: clientY,
  }
  const headCenter = {
    x: left + width / 2,
    y: top + height / 2,
  }
  const pupil = {
    top: mouse.y - headCenter.y,
    left: mouse.x - headCenter.x,
  }

  const topValue = getDampenedValue(pupil.top)
  const leftValue = getDampenedValue(pupil.left)

  pupils.forEach((pupil) => {
    pupil.style.top = `${topValue}rem`
    pupil.style.left = `${leftValue}rem`
  })
}

function init() {
  if (isTouchDevice()) {
    return randomMovement()
  }

  document.body.onmousemove = handleMouseMovement
  document.body.onmouseenter = clearRandomMovement
  document.body.onmouseleave = randomMovement

  randomMovement()
}

// events
window.onload = init
