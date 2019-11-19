import Ressource from './Ressource'
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three'
import ADN from './ADN'
import constants from 'utils/constants'

export default class Fellow extends Ressource {
  constructor (options) {
    super(options)
    this.ADN = new ADN(options.ADN)
    this.desire = 0
    this.hunger = 0
    this.direction = Math.random() * Math.PI * 2
    this.focus = null
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshBasicMaterial({ color: 0x00ff00 })
    this.body = new Mesh(geometry, material)
    this.add(this.body)
  }

  getSpeed () {
    const speed = (this.ADN.wings + this.ADN.size - this.ADN.weight) * 0.1
    return speed > 0 ? speed : 0.1
  }

  increaseHunger () {
    this.hunger += (this.ADN.morphology.size + this.ADN.morphology.weight) * 0.01
  }

  increaseDesire () {
    this.desire += this.ADN.morphology.interval * 0.01
  }

  increaseDirection () {
    this.direction += (Math.random() - 0.5) * 0.01
    if (Math.abs(this.position.x) >= constants.GROUND.SIZE / 2 ||
        Math.abs(this.position.y) >= constants.GROUND.SIZE / 2) {
      this.direction = -this.direction
    }
  }

  update () {
    this.increaseHunger()
    this.increaseDesire()
    this.increaseDirection()
  }

  findFocus (elements) {
    const distances = []
    elements.forEach((element) => {
      distances.push({ element: element, distance: this.position.distanceTo(element.class.position) })
    })

    const closest = distances.reduce((prev, cur) => {
      return prev.distance < cur.distance ? prev : cur
    }, +Infinity)
    this.focus = closest
  }

  move (elements, ground) {
    if (this.desire >= 1 || this.hunger >= 1) {
      if (!this.focus) {
        this.findFocus(elements)
      } else {
        const focus = elements.find((element) => element.id === this.focus.element.id)
        if (focus) {
          this.focus = { element: focus, distance: this.position.distanceTo(focus.class.position) }
        } else {
          this.findFocus(elements)
        }
      }
      const deltaX = (this.focus.element.class.position.x - this.position.x)
      const deltaY = (this.focus.element.class.position.y - this.position.y)
      this.position.x += (deltaX / Math.abs(deltaX)) * this.getSpeed()
      this.position.z += (deltaY / Math.abs(deltaY)) * this.getSpeed()
    } else {
      this.position.x += Math.cos(this.direction) * this.getSpeed()
      this.position.z += Math.sin(this.direction) * this.getSpeed()
    }
    this.position.y = ground.getHeight(this.position.x, this.position.z)
  }
}
