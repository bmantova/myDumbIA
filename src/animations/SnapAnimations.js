import Snap from 'snapsvg'

export default class SnapAnimations {
  constructor () {
    var svg = document.getElementById('evolution')
    Snap(svg)
    this.escargot = Snap.select('#escargot')
    this.mouton = Snap.select('#mouton')
    this.ours = Snap.select('#ours')
    this.escargotPoints = this.escargot.node.getAttribute('d')
    this.moutonPoints = this.mouton.node.getAttribute('d')
    this.oursPoints = this.ours.node.getAttribute('d')
    this.currentAnimation = null
  }

  toMouton () {
    this.currentAnimation = this.escargot.animate({ d: this.moutonPoints }, 1500, this.toOurs.bind(this))
  }

  toOurs () {
    this.currentAnimation = this.escargot.animate({ d: this.oursPoints }, 1500, this.toEscargot.bind(this))
  }

  toEscargot () {
    this.currentAnimation = this.escargot.animate({ d: this.escargotPoints }, 1500, this.toMouton.bind(this))
  }

  launch () {
    this.toMouton()
  }

  pause () {
    this.escargot.stop()
  }
}
