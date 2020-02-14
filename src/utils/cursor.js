// import constants from './constants'
import utils from 'utils/utils'

export default class Cursor {
  constructor (name, value = 0, min = 0, max = 100, virg = 0) {
    this.name = name
    this.val = value
    this.min = min
    this.max = max
    this.left = 0

    this.DOM = document.createElement('div')
    this.DOM.classList.add('cursor_dom')
    this.DOM.id = 'cursor_' + name
    this.DOM.innerHTML = name + ' '

    this.value = document.createElement('span')
    this.value.classList.add('cursor_value')
    this.value.innerHTML = value

    this.DOM.appendChild(this.value)

    this.container = document.createElement('div')
    this.container.classList.add('cursor_container')

    this.DOM.appendChild(this.container)

    this.cursor = document.createElement('div')
    this.cursor.classList.add('cursor')

    this.container.appendChild(this.cursor)

    this.update = function (val) {}

    this.down = false

    const self = this
    this.DOM.addEventListener('mousedown', (e) => {
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
    this.setLeft(0)
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

  setVirg (v) {
    this.virg = v
  }

  updateY (x) {
    const w = parseInt(this.container.offsetWidth)

    let offsetLeft = 0
    let node = this.container

    while (node.id !== 'Play') {
      offsetLeft += node.offsetLeft
      node = node.parentNode
    }

    this.setLeft(x - offsetLeft)
    this.updateValue((this.left / w) * (this.max - this.min) + this.min)

    this.update(this.val)
  }

  updateValue (val) {
    this.val = val
    this.value.innerHTML = utils.virg(this.val, this.virg)
  }

  setLeft (left) {
    this.left = utils.limit(left, 0, this.container.offsetWidth)
    this.cursor.style.left = this.left + 'px'
  }
}
