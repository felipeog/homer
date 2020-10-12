// consts
const headTop = document.querySelector('.top')
const eyes = headTop.querySelectorAll('[class$=-eye]')
const pupils = headTop.querySelectorAll('.pupil')
const transitionDuration = 4000
const maxTranslateValue = 160

// state
let intervalId = null

// movements based on mouse move
document.body.onmousemove = event => {
  const { top, left, width, height } = headTop.getBoundingClientRect()
  const { clientX: mouseX, clientY: mouseY, pageX, pageY } = event

  const headTopX = left + width / 2
  const headTopY = top + height / 2

  const mouseDistance = Math.hypot(mouseX - headTopX, mouseY - headTopY)
  const translateValue =
    mouseDistance * 0.5 > maxTranslateValue
      ? maxTranslateValue
      : mouseDistance * 0.5

  const rad = Math.atan2(pageX - headTopX, pageY - headTopY)
  const rotateValue = rad * (180 / Math.PI) * -1 + 90

  for (let i = 0; i < 2; i++) {
    pupils[i].style.transform = `translateX(${translateValue}%)`
    eyes[i].style.transform = `rotate(${rotateValue}deg)`
  }
}

// clear random movements on mouse enter
document.body.onmouseenter = () => {
  clearInterval(intervalId)

  for (let i = 0; i < 2; i++) {
    eyes[i].style.transition = 'none'
    pupils[i].style.transition = 'none'
  }
}

// random pupils movements on mouse leave
document.body.onmouseleave = () => {
  intervalId = setInterval(() => {
    const rotateValue = Math.random() * 360
    const translateValue = Math.random() * maxTranslateValue

    for (let i = 0; i < 2; i++) {
      eyes[i].style.transform = `rotate(${rotateValue}deg)`
      eyes[i].style.transition = `${transitionDuration}ms`

      pupils[i].style.transform = `translateX(${translateValue}%)`
      pupils[i].style.transition = `${transitionDuration}ms`
    }
  }, transitionDuration)
}
