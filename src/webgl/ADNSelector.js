import ADN from './objects/ADN'
import Cursor from 'utils/cursor'

export default class ADNSelector {
  constructor ($parent) {
    this.parent = document.querySelector('#' + $parent)
    this.chosenADN = new ADN()
  }

  init () {
    this.iterateOverADN(this.chosenADN.store)
  }

  iterateOverADN (obj) {
    return Object.keys(obj).reduce((acc, key) => {
      if (typeof obj[key] === 'object') {
        this.addTitle(key)
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
    this.currentCategory.appendChild(cursor.DOM)
    cursor.init()
  }

  updateChosenADN (name, value) {
    this.chosenADN.setParameters(name, value)
  }

  addTitle (name) {
    const title = document.createElement('div')
    title.id = name
    title.classList.add('selectorCategoryTitle')
    title.innerHTML = name
    this.parent.appendChild(title)
    this.currentCategory = document.querySelector('#' + name)
  }
}
