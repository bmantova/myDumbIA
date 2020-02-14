import constants from './constants'
import utils from './utils'
// import Cursor from './cursor'

export default class TimeScale {
  constructor () {
    this.elem = document.getElementById('time_scale')
    this.elem.innerHTML = 'timescale <span id="ts_value" class="cursor_value">' + constants.TIME.SPEED + '</span><div id="ts_cursor_container" class="cursor_container"><div id="ts_cursor" class="cursor"></div></div>'

    this.container = document.getElementById('ts_cursor_container')
    this.cursor = document.getElementById('ts_cursor')
    this.value = document.getElementById('ts_value')

    // const cursor = new Cursor('timescale')
    // cursor.setMax(5)

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
    const w = parseInt(this.container.offsetWidth)
    const val = utils.limit(x - this.container.offsetLeft - this.elem.offsetLeft, 0, w)
    this.cursor.style.left = val + 'px'

    const ratio = val / w
    constants.TIME.SPEED = ratio * ratio * ratio * 100 + 0.1
    this.value.innerHTML = constants.TIME.SPEED > 2 ? Math.round(constants.TIME.SPEED) : utils.virg(constants.TIME.SPEED)
  }
}
