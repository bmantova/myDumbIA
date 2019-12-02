import Ressource from './Ressource'
import { BoxGeometry, MeshBasicMaterial, Mesh, Color } from 'three'
import ADN from './ADN'
import constants from 'utils/constants'
import utils from 'utils/utils'

export default class Fellow extends Ressource {
  constructor (options) {
    super(options)
    this.ADN = new ADN(options.ADN)
    this.desire = 0
    this.hunger = 0
    this.age = 0
    this.direction = Math.random() * Math.PI * 2
    this.focus = null
    this.effectiveSize = this.ADN.morphology.size * 20
    this.unfuckableEx = []
    const geometry = new BoxGeometry(this.effectiveSize, this.effectiveSize, this.effectiveSize)
    const material = new MeshBasicMaterial({ color: new Color('hsl(' + Math.round(this.ADN.morphology.color * 360) + ' ,100%, 50%)') })
    this.body = new Mesh(geometry, material)
    this.add(this.body)
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

  increaseAge () {
    this.age += (1 / this.ADN.capacity.longevity) * 0.00005
  }

  increaseEffectiveSize () {
    this.effectiveSize = this.age * this.ADN.morphology.size * 20 + 1
    this.body.scale.set(this.effectiveSize, this.effectiveSize, this.effectiveSize)
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
    this.increaseAge()
    this.increaseEffectiveSize()
  }

  getClosest (array) {
    const distances = []
    array.forEach((element) => {
      distances.push({ element: element, distance: this.position.distanceTo(element.position) })
    })

    return distances.reduce((prev, cur) => {
      return prev.distance < cur.distance ? prev : cur
    }, +Infinity)
  }

  ejectUnfuckableEx (array) {
    if (this.unfuckableEx.length === 0) {
      return array
    }
    return array.filter((e) => {
      return !this.unfuckableEx.includes(e)
    })
  }

  findFocus (webgl) {
    if (this.hunger >= 1) {
      if (webgl.fellows.length > 1) {
        const diet = this.clamp(Math.random() * this.ADN.diet.carnivorous, 0, 1)
        if (diet > 0.5) {
          this.focus = this.getClosest(webgl.getOthers(this))
        } else {
          this.focus = this.getClosest(webgl.ground.vegetation)
        }
      } else {
        this.focus = this.getClosest(webgl.ground.vegetation)
      }
    } else {
      this.focus = this.getClosest(this.ejectUnfuckableEx(webgl.getOthers(this)))
    }
  }

  updateFocus (webgl) {
    let findedFocus = null
    if (this.focus.element.type === constants.RESSOURCES.TYPES.MEAT) {
      findedFocus = webgl.fellows.find((fellow) => fellow.id === this.focus.element.id)
    } else {
      findedFocus = webgl.ground.vegetation.find((tree) => tree.id === this.focus.element.id)
    }

    if (findedFocus) {
      this.focus = { element: findedFocus, distance: this.position.distanceTo(findedFocus.position) }
    } else {
      this.findFocus(webgl)
    }
  }

  canFuck (webgl) {
    return this.desire >= 1 && webgl.fellows.length > 1
  }

  canEat (webgl) {
    return this.hunger >= 1 &&
          ((this.ADN.diet.carnivorous < 1 && webgl.ground.vegetation.length > 1) ||
          (this.ADN.diet.carnivorous === 1 && webgl.fellows.length > 1))
  }

  handleDesire (webgl) {
    this.handleReproduction(webgl)
    if (this.focus.element.hunger >= 1) {
      this.focus.element.hunger = 0
      webgl.removeFellow(this)
      this.focus.element.focus = null
    }
    this.focus = null
  }

  handleReproduction (webgl) {
    if (this.ADN.canFuckWith(this.focus.element.ADN)) {
      this.focus.element.desire = 0
      this.desire = 0
      this.handleBirth(webgl)
    } else {
      this.unfuckableEx.push(this.focus.element)
    }
  }

  handleBirth (webgl) {
    for (let i = 0; i < Math.floor(this.ADN.reproduction.litter * 10); i++) {
      webgl.addFellow(new Fellow({ ADN: this.ADN.getADNFromReproductionWith(this.focus.element.ADN) }), this.position)
    }
  }

  handleHunger (webgl) {
    this.hunger = 0
    if (this.focus.element.type === constants.RESSOURCES.TYPES.MEAT) {
      if (this.focus.element.desire >= 1) {
        this.handleReproduction(webgl)
      }
      webgl.removeFellow(this.focus.element)
    } else {
      webgl.ground.removeTree(this.focus.element)
    }
    this.focus = null
  }

  handleCollision (webgl) {
    if (this.position.distanceTo(this.focus.element.position) < (this.effectiveSize + this.focus.element.effectiveSize)) {
      if (this.hunger >= 1) {
        this.handleHunger(webgl)
      } else if (this.desire >= 1) {
        this.handleDesire(webgl)
      }
    }
  }

  move (webgl) {
    if (this.canFuck(webgl) || this.canEat(webgl)) {
      if (!this.focus || this.focus === 'undefined') {
        this.findFocus(webgl)
      } else {
        this.updateFocus(webgl)
      }
      const deltaX = (this.focus.element.position.x - this.position.x)
      const deltaZ = (this.focus.element.position.z - this.position.z)
      if (deltaX !== 0) {
        this.position.x += (deltaX / Math.abs(deltaX)) * this.getSpeed()
      }
      if (deltaZ !== 0) {
        this.position.z += (deltaZ / Math.abs(deltaZ)) * this.getSpeed()
      }
      this.handleCollision(webgl)
    } else {
      this.position.x += Math.cos(this.direction) * this.getSpeed()
      this.position.z += Math.sin(this.direction) * this.getSpeed()
    }
    this.clampPosition()
    this.position.y = webgl.ground.getHeight(this.position.x, this.position.z) + this.effectiveSize
  }

  handleDeath (webgl) {
    if (this.hunger >= 2 || this.age >= 1) {
      webgl.removeFellow(this)
      console.log('mort vieillesse')
    }
  }

  toString () {
    let str = ''
    str += 'age<b>' + utils.virg(this.age)
    str += '</b><br/>color<b>' + utils.virg(this.ADN.morphology.color, 2)
    str += '</b><br/>desire<b>' + utils.virg(this.desire)
    str += '</b><br/>hunger<b>' + utils.virg(this.hunger)
    return str
  }
}
