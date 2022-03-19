import { createMachine, interpret } from 'xstate'

import { isTouchDevice } from './utils/isTouchDevice'

// consts
const headTop = document.querySelector('.top')
const pupils = Array.from(headTop.querySelectorAll('.pupil'))

// state machine
const mouseStateMachine = createMachine({
  id: 'mouse-state',
  initial: 'outside',
  states: {
    inside: {
      on: {
        OUTSIDE: { target: 'outside' },
      },
    },
    outside: {
      on: {
        INSIDE: { target: 'inside' },
      },
    },
  },
})

const mouseStateService = interpret(mouseStateMachine).onTransition((state) => {
  switch (state.value) {
    case 'outside':
      startRandomMovement()
      break

    case 'inside':
      stopRandomMovement()
      break

    default:
      console.error('Invalid state.value: ', state.value)
      break
  }
})

// state
let randomMovementIntervalId = null

// functions
function getDampenedValue(value) {
  const isNegative = value < 0
  const dampenedValue = Math.sqrt(Math.abs(value)) * 0.08

  return isNegative ? dampenedValue * -1 : dampenedValue
}

function startRandomMovement() {
  randomMovementIntervalId = setInterval(() => {
    const topValue = Math.random() * 4 - 2
    const leftValue = Math.random() * 4 - 2
    const transitionDuration = Math.random() * 4_000

    pupils.forEach((pupil) => {
      pupil.style.top = `${topValue}rem`
      pupil.style.left = `${leftValue}rem`
      pupil.style.transition = `${transitionDuration}ms`
    })
  }, 4_000)
}

function stopRandomMovement() {
  clearInterval(randomMovementIntervalId)

  pupils.forEach((pupil) => {
    pupil.style.transition = '100ms'
  })
}

function handleMouseMove(event) {
  if (mouseStateService.getSnapshot().value === 'outside') {
    mouseStateService.send({ type: 'INSIDE' })
  }

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

function handleMouseEnter() {
  mouseStateService.send({ type: 'INSIDE' })
}

function handleMouseLeave() {
  mouseStateService.send({ type: 'OUTSIDE' })
}

function init() {
  if (!isTouchDevice()) {
    document.body.onmousemove = handleMouseMove
    document.body.onmouseenter = handleMouseEnter
    document.body.onmouseleave = handleMouseLeave
  }

  mouseStateService.start()
}

// events
window.onload = init
