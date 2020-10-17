// consts
const headTop = document.querySelector('.top')
const pupils = Array.from(headTop.querySelectorAll('.pupil'))

// state
let intervalId = null

// functions
const isTouchDevice = () => {
  // https://stackoverflow.com/a/4819886/10942224
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  const mq = query => {
    return !!window.matchMedia(query).matches
  }

  if (
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true
  }

  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')

  return !!mq(query)
}

const randomMovement = () => {
  intervalId = setInterval(() => {
    const topValue = Math.random() * 4 - 2
    const leftValue = Math.random() * 4 - 2
    const randomDuration = Math.random() * 4000

    pupils.forEach(pupil => {
      pupil.style.top = `${topValue}rem`
      pupil.style.left = `${leftValue}rem`
      pupil.style.transition = `${randomDuration}ms`
    })
  }, 4000)
}

const clearRandomMovement = () => {
  if (isTouchDevice()) return

  clearInterval(intervalId)

  pupils.forEach(pupil => {
    pupil.style.transition = '100ms'
  })
}

const handleMouseMovement = event => {
  if (isTouchDevice()) return

  const { top, left, width, height } = headTop.getBoundingClientRect()
  const { clientX, clientY } = event
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

  const topValue = getDampanedValue(pupil.top)
  const leftValue = getDampanedValue(pupil.left)

  pupils.forEach(pupil => {
    pupil.style.top = `${topValue}rem`
    pupil.style.left = `${leftValue}rem`
  })
}

const getDampanedValue = value => {
  const squareRootDamp =
    value < 0 ? Math.sqrt(Math.abs(value)) * -1 : Math.sqrt(value)
  const multiplyDamp = squareRootDamp * 0.08

  return multiplyDamp
}

// events
document.body.onmousemove = handleMouseMovement
document.body.onmouseenter = clearRandomMovement
document.body.onmouseleave = randomMovement
window.onload = randomMovement
