import constants from 'utils/constants'
import utils from 'utils/utils'

export default class Fellow extends Ressource {
  constructor (options) {
    this.canvas = options.canvas
    this.w = canvas.width
    this.h = canvas.height
    this.data = []
  }

  setValues (probs) {
    this.data[this.data.length] = probs
  }

  showGraph () {
    const ctx = this.canvas.getContext('2d')
    const colors = {}
    let n = 0
    for (let key in data[0]) n++
    let i = 0
    for (let key in data[0]) {
      colors[key] = 'hsl(' + ((360 / n) * i) + ',100%, 50%)'
      i++
    }

    let max = 0
    let min = 0

    for (let i = 0; i < this.data.length;i++) {
      for (let key in data[i]) {
        if(this.data[i][key] > max) max = this.data[i][key]
        if(this.data[i][key] < min) min = this.data[i][key]
      }
    }

    const wStep = this.w / this.data.length
    const hStep = this.h / (this.max - this.min)

    for (let key in data[i]) {
      ctx.strokeStyle = colors[key]
      ctx.beginPath()
      ctx.moveTo(0, data[0][key] * hStep)
      for (let i = 0; i < this.data.length;i++) {
        ctx.lineTo(i * wStep, data[i][key] * wStep)
      }
      ctx.stroke()
    }
  }
}
