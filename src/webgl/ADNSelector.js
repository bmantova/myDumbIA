import ADN from './objects/ADN'
import Cursor from 'utils/cursor'

export default class ADNSelector {
  constructor ($parent) {
    this.parent = document.querySelector('#' + $parent)
    this.chosenADN = new ADN()
    this.cursors = []
  }

  init () {
    this.iterateOverADN(this.chosenADN.store)
    this.drawSelectorCard()
  }

  iterateOverADN (obj) {
    return Object.keys(obj).reduce((acc, key) => {
      if (typeof obj[key] === 'object') {
        this.iterateOverADN(obj[key])
      } else if (Object.prototype.hasOwnProperty.call(obj, key) && !isNaN(parseFloat(obj[key]))) {
        this.addCursor(key, obj[key])
      }
      return acc
    }, [])
  }

  addCursor (name, value) {
    const cursor = new Cursor(name, value * 100)
    const self = this
    cursor.setUpdate((value) => { self.updateChosenADN(name, value / 100) })
    this.cursors.push(cursor)
  }

  drawSelectorCard () {
    for (let i = 0; i < this.cursors.length; i++) {
      this.parent.appendChild(this.cursors[i].DOM)
    }
  }

  updateChosenADN (name, value) {
    this.chosenADN.setParameters(name, value)
  }
}
