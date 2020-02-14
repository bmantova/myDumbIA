import constants from './constants'
import utils from './utils'
import Cursor from './cursor'

export default class TimeScale {
  constructor () {
    this.elem = document.getElementById('time_scale')

    const cursor = new Cursor('timescale', 2)
    this.elem.appendChild(cursor.DOM)
    cursor.init()
    cursor.setVirg(1)
    cursor.setUpdate((val) => {
      const ratio = val / 100
      const trueValue = ratio * ratio * ratio * 100 + 0.1
      constants.TIME.SPEED = trueValue
      cursor.updateValue(trueValue > 2 ? Math.round(trueValue) : utils.virg(trueValue))
    })
  }
}
