import Ressource from './Ressource'
import { BoxGeometry, MeshBasicMaterial, Mesh, Color } from 'three'
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
    this.effectiveSize = this.ADN.morphology.size * 20
    const geometry = new BoxGeometry(this.effectiveSize, this.effectiveSize, this.effectiveSize)
    const material = new MeshBasicMaterial({ color: new Color('hsl(' + Math.round(this.ADN.morphology.color * 360) + ' ,100%, 50%)') })
    this.body = new Mesh(geometry, material)
    this.add(this.body)
    this.test = 0
  }

  getSpeed () {
    const speed = (this.ADN.morphology.wings + this.ADN.morphology.size - this.ADN.morphology.weight * 0.5) * 10
    return speed > 0 ? speed : 0.01
  }

  increaseHunger () {
    this.hunger += (this.ADN.morphology.size + this.ADN.morphology.weight) * 0.005
  }

  increaseDesire () {
    this.desire += this.ADN.reproduction.interval * 0.005
  }

  increaseDirection () {
    this.direction += (Math.random() - 0.5) * 0.5
    if (Math.abs(this.position.x) >= constants.GROUND.SIZE / 2 ||
        Math.abs(this.position.z) >= constants.GROUND.SIZE / 2) {
      this.direction = -this.direction
    }
  }

  clampPosition () {
    this.position.x = this.clamp(this.position.x, -constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)
    this.position.z = this.clamp(this.position.z, -constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)
  }

  clamp (v, a, b) {
    if (v < a) return a
    if (v > b) return b
    return v
  }

  update () {
    this.increaseHunger()
    this.increaseDesire()
    this.increaseDirection()
  }

  findFocus (webgl) {
    const others = webgl.getOthers(this)
    const distances = []
    others.forEach((element) => {
      distances.push({ element: element, distance: this.position.distanceTo(element.position) })
    })

    const closest = distances.reduce((prev, cur) => {
      return prev.distance < cur.distance ? prev : cur
    }, +Infinity)
    this.focus = closest
  }

  move (webgl, ground) {
    if ((this.desire >= 1 || this.hunger >= 1) && webgl.elements.length > 1) {
      if (!this.focus) {
        this.findFocus(webgl)
      } else {
        const findedFocus = webgl.elements.find((element) => element.id === this.focus.element.id)
        if (findedFocus) {
          this.focus = { element: findedFocus, distance: this.position.distanceTo(findedFocus.position) }
        } else {
          this.findFocus(webgl)
        }
      }
      const deltaX = (this.focus.element.position.x - this.position.x)
      const deltaZ = (this.focus.element.position.z - this.position.z)
      if (deltaX !== 0) {
        this.position.x += (deltaX / Math.abs(deltaX)) * this.getSpeed()
      }
      if (deltaZ !== 0) {
        this.position.z += (deltaZ / Math.abs(deltaZ)) * this.getSpeed()
      }
      if (this.position.distanceTo(this.focus.element.position) < (this.effectiveSize + this.focus.element.effectiveSize)) {
        if (this.desire >= 1) {
          this.focus.element.desire = 0
          this.desire = 0
          if (this.ADN.canFuckWith(this.focus.element.ADN)) {
            for (let i = 0; i < Math.floor(this.ADN.reproduction.litter * 10); i++) {
              webgl.addFellow(new Fellow({ ADN: this.ADN.getADNFromReproductionWith(this.focus.element.ADN) }), this.position)
              console.log('fellow né ')
              console.log(this.ADN.getADNFromReproductionWith(this.focus.element.ADN))
            }
          }
          if (this.focus.element.hunger >= 1) {
            this.focus.element.hunger = 0
            webgl.removeFellow(this)
            this.focus.element.focus = null
            console.log('fellow mort')
          }
          this.focus = null
        } else if (this.hunger >= 1) {
          this.hunger = 0
          webgl.removeFellow(this.focus.element)
          console.log('fellow mort')
          this.focus = null
        }
      }
    } else {
      this.position.x += Math.cos(this.direction) * this.getSpeed()
      this.position.z += Math.sin(this.direction) * this.getSpeed()
    }
    this.clampPosition()
    this.position.y = ground.getHeight(this.position.x, this.position.z) + this.effectiveSize * 0.5
  }
}
