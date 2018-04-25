var container = document.body
function invalidSelect (el) {
  return !el || el.tagName !== 'SELECT' || el.multiple
}
function popSelect (el) {
  if (invalidSelect(el)) return
  const {length} = el.options
  const pop = el.cloneNode(true)
  const {top, left} = getPosition(el)
  let isKeyDown = false
  pop.style = `position:absolute; left:${left}px; top:${top}px;`
  pop.size = length
  pop.tabIndex = 0
  pop.selectedIndex = el.selectedIndex
  const removeSelect = (isEscape) => {
    if (pop.isRemoved) return
    const {selectedIndex} = pop
    pop.isRemoved = true
    pop.remove() // this will trigger onblur!!
    el.focus()
    if (selectedIndex != el.selectedIndex && !isEscape) {
      el.selectedIndex = selectedIndex
      triggerChange(el)
    }
  }
  pop.onclick = pop.onchange = pop.onblur = e => {
    if (isKeyDown && e.type == 'change') return
    removeSelect()
  }
  pop.onblur = e => {
    removeSelect(true)
  }
  pop.onkeydown = e => {
    if (e.keyCode == 27) { // esc
      setTimeout(() => removeSelect(true))
    }
    else if ([13, 32].indexOf(e.keyCode) > -1) { // space
      setTimeout(removeSelect)
    }
    isKeyDown = true
  }
  pop.onkeyup = e => {
    isKeyDown = false
  }
  container.appendChild(pop)
  pop.focus()
}

function getPosition (elem) {
  var top = 0, left = 0
  while(elem) {
    top = top + (elem.offsetTop | 0)
    left = left + (elem.offsetLeft | 0)
    elem = elem.offsetParent
  }
  return {top: top, left: left}
}

function triggerChange (el) {
  if ('createEvent' in document) {
    var evt = document.createEvent('HTMLEvents')
    evt.initEvent('change', false, true)
    el.dispatchEvent(evt)
  } else {
    el.fireEvent('onchange')
  }
}

function applySelect (el) {
  if (invalidSelect(el) || el.hasPopSelect) return
  el.addEventListener('mousedown', e => {
    e.preventDefault()
    popSelect(el)
  })
  el.addEventListener('keydown', e => {
    if ([13, 32, 38, 40].indexOf(e.keyCode) > -1) {
      popSelect(el)
    }
    e.preventDefault()
  })
  el.hasPopSelect = true
}

module.exports = {
  applySelect,
  popSelect,
  getPosition
}
