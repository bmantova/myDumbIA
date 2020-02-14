import ADN from './objects/ADN'
// import Cursor from 'utils/cursor'

export default class ADNSelector {
  constructor ($parent) {
    this.parent = document.querySelector('#' + $parent)
    this.defaultADN = new ADN()
    this.cursors = []
  }

  init () {
    this.iterateOverADN(this.defaultADN.store)
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
    // this.cursors.push(new Cursor(name, value))
  }

  drawSelectorCard () {
    for (let i = 0; i < this.cursors.length; i++) {
      this.parent.appendChild(this.cursors[i].DOM)
    }
  }
}
