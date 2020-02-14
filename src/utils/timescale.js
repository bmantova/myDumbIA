import constants from './constants'
import utils from 'utils/utils'

export default class TimeScale {
  constructor () {
    this.elem = document.getElementById('time_scale')
    this.elem.innerHTML = 'timescale <span id="ts_value">' + constants.TIME.SPEED + '</span><div id="ts_cursor_container"><div id="ts_cursor"></div></div>'
    this.elem.style.position = 'fixed'
    this.elem.style.right = '0px'
    this.elem.style.bottom = '0px'
    this.elem.style.padding = '5px'
    this.elem.style.borderRadius = '5px 0px 0px 0px'
    this.elem.style.backgroundColor = 'rgba(0,0,0,0.5)'
    this.elem.style.color = '#AAA'
    this.elem.style.fontSize = '13px'

    this.container = document.getElementById('ts_cursor_container')
    this.cursor = document.getElementById('ts_cursor')
    this.value = document.getElementById('ts_value')

    this.container.style.height = '5px'
    this.container.style.width = '200px'
    this.container.style.backgroundColor = 'rgba(50,50,50,0.5)'
    this.container.style.borderRadius = '2px'
    this.container.style.margin = '10px'
    this.container.style.cursor = 'pointer'

    this.value.style.color = 'white'
    this.value.style.fontSize = '16px'

    this.cursor.style.backgroundColor = 'white'
    this.cursor.style.borderRadius = '5px'
    this.cursor.style.position = 'relative'
    this.cursor.style.left = '15px'
    this.cursor.style.top = '-2px'
    this.cursor.style.width = '10px'
    this.cursor.style.height = '10px'
    this.cursor.style.cursor = 'pointer'

    this.down = false
    const self = this

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

  updateY (x) {
    const w = parseInt(this.container.style.width)
    const val = utils.limit(x - this.container.offsetLeft - this.elem.offsetLeft, 0, w)
    this.cursor.style.left = val + 'px'

    const ratio = val / w
    constants.TIME.SPEED = ratio * ratio * ratio * 100 + 0.1
    this.value.innerHTML = constants.TIME.SPEED > 2 ? Math.round(constants.TIME.SPEED) : utils.virg(constants.TIME.SPEED)
  }
}
