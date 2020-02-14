// import constants from './constants'
// import utils from 'utils/utils'

export default class Cursor {
  constructor (name, value = 50, min = 0, max = 100) {
    this.name = name
    this.value = value
    this.min = min
    this.max = max

    this.DOM = document.createElement('div')
    this.DOM.classlist.add('cursor_dom')
    this.DOM.id = 'cursor_' + name
    this.DOM.innerHTML = name

    this.value = document.createElement('span')
    this.value.classlist.add('cursor_value')
    this.value.innerHTML = value

    this.DOM.appendChild(this.value)

    this.container = document.createElement('div')
    this.container.classList.add('cursor_container')

    this.DOM.appendChild(this.container)

    this.cursor = document.createElement('div')
    this.cursor.classList.add('cursor')

    this.container.appendChild(this.cursor)

    this.elem.addEventListener('mousedown', (e) => {
      self.down = true
    })
    window.addEventListener('mouseup', (e) => {
      self.down = false
    })
    window.addEventListener('mousemove', (e) => {
      if (self.down) self.updateY(e.clientX)
    })
    this.container.addEventListener('click', (e) => {
      self.updateY(e.clientX)
    })
  }

  setMin (val) {
    this.min = val
  }

  setMax (val) {
    this.max = val
  }

  setUpdate (func) {
    this.update = func
  }
}
