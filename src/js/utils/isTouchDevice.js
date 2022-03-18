// https://stackoverflow.com/a/4819886/10942224
export function isTouchDevice() {
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  const mq = (query) => {
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
