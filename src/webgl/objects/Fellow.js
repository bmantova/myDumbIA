import Ressource from './Ressource'
import { BoxGeometry, Mesh, RawShaderMaterial } from 'three'
import ADN from './ADN'
import constants from 'utils/constants'
import utils from 'utils/utils'

import fellowVertexShader from './ObjectShader/fellow.vs'
import fellowFragmentShader from './ObjectShader/fellow.fs'

/* TODO
  - Mode Debug
  - Maladies
  - Direction focus
*/
export default class Fellow extends Ressource {
  constructor (options) {
    super(options)
    this.ADN = new ADN(options.ADN)
    this.desire = 0
    this.hunger = 0
    this.age = 0
    this.suitsCoeff = 0
    this.direction = Math.random() * Math.PI * 2
    this.focus = null
    this.effectiveSize = this.ADN.morphology.size * 0.1
    this.unfuckableEx = []
    this.uneatableEx = []
    this.virus = false

    const material = new RawShaderMaterial({
      uniforms: {
        uDay: {
          value: 0.0
        },
        uColor: {
          value: 0.0
        },
        uFur: {
          value: this.ADN.morphology.fur
        },
        uVirus: {
          value: 0
        }
      },
      vertexShader: fellowVertexShader,
      fragmentShader: fellowFragmentShader,
      flatShading: false
    })
    if (options.object) {
      this.body = options.object.clone()
      this.object = options.object

      const neckSize = this.ADN.morphology.neck * 2 + 0.001
      this.body.neck.scale.set(neckSize, neckSize, neckSize)

      const headSize = (1 / neckSize) * this.ADN.morphology.head * 2 + 0.001
      this.body.head.scale.set(headSize, headSize, headSize)

      const legsSize = this.ADN.morphology.legs * 2 + 0.001
      this.body.leftLeg.scale.set(legsSize, legsSize, legsSize)
      this.body.rightLeg.scale.set(legsSize, legsSize, legsSize)

      const footSize = this.ADN.morphology.feet * 2 + 0.001
      this.body.leftFoot.scale.set(footSize, footSize, footSize)
      this.body.rightFoot.scale.set(footSize, footSize, footSize)

      const armsSize = this.ADN.morphology.arms * 2 + 0.001
      this.body.leftArm.scale.set(armsSize, armsSize, armsSize)
      this.body.rightArm.scale.set(armsSize, armsSize, armsSize)

      const tailSize = this.ADN.morphology.tail * 2 + 0.001
      this.body.tail.scale.set(tailSize, tailSize, tailSize)

      const wingsSize = this.ADN.capacity.fly * 2 + 0.001
      this.body.leftWing.scale.set(wingsSize, wingsSize, wingsSize)
      this.body.rightWing.scale.set(wingsSize, wingsSize, wingsSize)

      const self = this
      this.body.traverse((el) => {
        if (el.isMesh) {
          el.material = material
          el.material.uniforms.uColor.value = self.ADN.morphology.color
        }
      })
    } else {
      const geometry = new BoxGeometry(this.effectiveSize, this.effectiveSize, this.effectiveSize)
      this.body = new Mesh(geometry, material)
    }
    this.add(this.body)

    this.timer = 0
    this.previous = 0
    this.timeSeed = utils.randint(0, 100)
  }

  getSpeed () {
    const speed = (this.ADN.capacity.fly * 0.5 + this.ADN.morphology.size * 0.5 + this.ADN.morphology.legs * 0.5 - this.ADN.morphology.weight * 0.5) * (Math.sin(this.age * Math.PI) + 0.2)
    return (speed > 0 ? speed : 0.005) * constants.TIME.SPEED
  }

  increaseHunger () {
    this.hunger += (this.ADN.morphology.size + this.ADN.morphology.weight) * 0.003 * constants.TIME.SPEED
  }

  increaseDesire () {
    this.desire += this.ADN.reproduction.interval * 0.003 * constants.TIME.SPEED
  }

  increaseDirection () {
    this.direction += (Math.random() - 0.5) * 0.1 * constants.TIME.SPEED
    if (Math.abs(this.position.x) >= constants.GROUND.SIZE / 2 ||
        Math.abs(this.position.z) >= constants.GROUND.SIZE / 2) {
      this.direction = -this.direction
    }
  }

  updateSuitsCoeff (webgl) {
    const biome = webgl.ground.getBiomeInfo(this.position.x, this.position.y)
    this.suitsCoeff = this.ADN.getSuitsCoeff(biome)
  }

  increaseAge () {
    this.age += ((1 / this.ADN.capacity.longevity) + this.suitsCoeff + (this.virus ? this.virus.mortality : 0)) * 0.00005 * constants.TIME.SPEED
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

  update (webgl) {
    this.increaseHunger()
    this.increaseDesire()
    this.increaseDirection()
    this.updateSuitsCoeff(webgl)
    this.increaseAge()
    this.increaseEffectiveSize()
    this.animate(webgl)
    this.body.traverse((el) => {
      if (el.material) el.material.uniforms.uDay.value = Math.sin(webgl.currentTime * 0.01)
    })
    this.timer++
  }

  getClosest (array) {
    const distances = []
    array.forEach((element) => {
      const dist = this.position.distanceTo(element.position)
      if (element.type === constants.RESSOURCES.TYPES.MEAT && this.virus && !element.virus && dist < this.virus.distance && Math.random() < this.virus.transmission) {
        element.catchVirus(this.virus)
      }
      distances.push({ element: element, distance: dist })
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

  ejectUneatableEx (array) {
    if (this.uneatableEx.length === 0) {
      return array
    }
    return array.filter((e) => {
      return !this.uneatableEx.includes(e)
    })
  }

  findFocus (webgl) {
    if (this.hunger >= 1) {
      if (webgl.fellows.length !== 0 && webgl.ground.vegetation.length !== 0) {
        const diet = this.clamp((Math.random() * this.ADN.diet.carnivorous), 0, 1)
        const others = this.ejectUneatableEx(webgl.getOthers(this))
        if (diet > 0.5) {
          this.focus = this.getClosest(others)
        } else {
          this.focus = this.getClosest(webgl.ground.vegetation)
        }
      } else {
        this.focus = null
      }
    } else {
      const others = this.ejectUnfuckableEx(webgl.getOthers(this))
      if (others.length !== 0) {
        this.focus = this.getClosest(others)
      } else {
        this.focus = null
      }
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
    console.log('coucouc')
    const rand = Math.random()
    for (let i = 0; i < Math.floor(this.ADN.reproduction.litter * 10 * rand); i++) {
      const newADN = this.ADN.getADNFromReproductionWith(this.focus.element.ADN)
      console.log('coucouc')
      webgl.addFellow(new Fellow({ ADN: newADN, object: this.body }), this.position)
    }
  }

  handleHunger (webgl) {
    this.hunger = 0
    if (this.focus.element.type === constants.RESSOURCES.TYPES.MEAT) {
      /* if (this.focus.element.desire >= 1 || this.desire >= 1) {
        this.handleReproduction(webgl)
      } */
      if (!this.ADN.canFuckWith(this.focus.element.ADN)) {
        webgl.removeFellow(this.focus.element)
      } else {
        this.uneatableEx.push(this.focus.element)
      }
    } else {
      webgl.ground.removeTree(this.focus.element)
    }
    this.focus = null
  }

  handleCollision (webgl) {
    if (this.position.distanceTo(this.focus.element.position) < (this.effectiveSize + this.focus.element.effectiveSize + this.getSpeed() + this.focus.element.getSpeed())) {
      if (this.hunger >= 1) {
        this.handleHunger(webgl)
      } else if (this.desire >= 1) {
        this.handleDesire(webgl)
      }
    }
  }

  canFuck (webgl) {
    return this.desire >= 1 && webgl.fellows.length > 1
  }

  canEat (webgl) {
    return this.hunger >= 1 && (webgl.ground.vegetation.length > 0 || webgl.fellows.length > 1)
  }

  catchVirus (virus) {
    this.body.traverse((el) => {
      if (el.material) {
        el.material.uniforms.uVirus.value = 1.0
      }
    })
    this.virus = virus
  }

  move (webgl) {
    if (this.canFuck(webgl) || this.canEat(webgl)) {
      if (!this.focus) {
        this.findFocus(webgl)
      } else {
        this.updateFocus(webgl)
      }

      if (this.focus && this.focus.element) {
        const deltaX = (this.focus.element.position.x - this.position.x)
        const deltaZ = (this.focus.element.position.z - this.position.z)
        if (deltaX !== 0) {
          this.position.x += (deltaX / Math.abs(deltaX)) * this.getSpeed()
        }
        if (deltaZ !== 0) {
          this.position.z += (deltaZ / Math.abs(deltaZ)) * this.getSpeed()
        }
        this.handleCollision(webgl)
        this.rotation.y = Math.atan(deltaZ / deltaX)
      } else {
        this.position.x += Math.cos(this.direction) * this.getSpeed()
        this.position.z += Math.sin(this.direction) * this.getSpeed()
        this.rotation.y = -this.direction - Math.PI / 2
      }
    } else {
      this.position.x += Math.cos(this.direction) * this.getSpeed()
      this.position.z += Math.sin(this.direction) * this.getSpeed()
      this.rotation.y = -this.direction - Math.PI / 2
    }
    this.clampPosition()
    this.position.y = webgl.ground.getHeight(this.position.x, this.position.z) - 2 + this.ADN.morphology.legs * 4
  }

  animate (webgl) {
    const t = (webgl.currentTime + this.timeSeed) * 0.1
    this.body.tail.rotation.y = Math.sin(t) * 0.2 * this.desire

    this.body.leftLeg.rotation.x = Math.sin(t * this.getSpeed() * 3) * 0.5
    this.body.rightLeg.rotation.x = Math.sin(t * this.getSpeed() * 3 + Math.PI) * 0.5

    this.body.leftArm.rotation.x = Math.sin(t * this.getSpeed()) * 0.3
    this.body.rightArm.rotation.x = Math.sin(t * this.getSpeed() + Math.PI) * 0.3

    this.body.leftWing.rotation.z = Math.sin(t * 6 * (1 - this.ADN.capacity.fly)) * 0.5
    this.body.rightWing.rotation.z = -Math.sin(t * 6 * (1 - this.ADN.capacity.fly)) * 0.5

    this.body.neck.rotation.y = Math.sin(t * 2) * 0.2
    this.body.head.rotation.z = Math.sin(t * 2) * 0.2

    this.body.neck.rotation.x = Math.sin(t * 2) * 0.2 * this.hunger
  }

  handleDeath (webgl) {
    if (this.hunger >= 2 || this.age >= 1) {
      webgl.removeFellow(this)
      console.log('mort vieillesse ou de faim')
    }
  }

  toString () {
    let str = ''
    str += 'age<b>' + utils.virg(this.age)
    str += '</b><br/>color<b>' + utils.virg(this.ADN.morphology.color, 2)
    str += '</b><br/>desire<b>' + utils.virg(this.desire)
    str += '</b><br/>hunger<b>' + utils.virg(this.hunger)
    str += '</b><br/>adaptation<b>' + utils.virg(this.ADN.capacity.adaptation)
    str += '</b><br/>fly<b>' + utils.virg(this.ADN.capacity.fly)
    str += '</b><br/>diet<b>' + utils.virg(this.ADN.diet.carnivorous)
    str += '</b><br/>longevity<b>' + utils.virg(this.ADN.capacity.longevity)
    str += '</b><br/>speed<b>' + utils.virg(this.getSpeed())
    str += '</b><br/>virus<b>' + (this.virus ? 'true' : 'false')
    return str
  }
}
