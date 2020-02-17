import Ressource from './Ressource'
import { Mesh, RawShaderMaterial, SphereBufferGeometry } from 'three'
import ADN from './ADN'
import constants from 'utils/constants'
import utils from 'utils/utils'

import fellowVertexShader from './ObjectShader/fellow.vs'
import fellowFragmentShader from './ObjectShader/fellow.fs'

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
    this.effectiveSize = 0.2
    this.unfuckableEx = []
    this.uneatableEx = []
    this.virus = false
    this.flyingOffset = utils.randint(0, 1000)

    this.firstname = constants.RD.NAMES[utils.randint(0, constants.RD.NAMES.length - 1)]

    this.type = constants.RESSOURCES.TYPES.MEAT

    const material = new RawShaderMaterial({
      uniforms: {
        uDay: {
          value: 2.0
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
      this.body.scale.set(this.effectiveSize, this.effectiveSize, this.effectiveSize)

      let neckSize = 1

      neckSize = this.ADN.morphology.neck * 2 + 0.001
      this.body.neck.scale.set(neckSize, neckSize, neckSize)

      if (this.ADN.morphology.head <= 0.1) {
        this.body.head.visible = false
      } else {
        const headSize = (1 / neckSize) * this.ADN.morphology.head * 2 + 0.001
        this.body.head.scale.set(headSize, headSize, headSize)
      }

      if (this.ADN.morphology.legs <= 0.1) {
        this.body.leftLeg.visible = false
        this.body.rightLeg.visible = false
      } else {
        const legsSize = this.ADN.morphology.legs * 2 + 0.001 * (this.ADN.morphology.nLegs <= 0.25 ? 0 : 1)
        this.body.leftLeg.scale.set(legsSize, legsSize, legsSize)
        this.body.rightLeg.scale.set(legsSize, legsSize, legsSize)

        this.otherLegs = []
        for (let i = 0; i < Math.floor(4 * this.ADN.morphology.nLegs) - 1; i++) {
          const lLeg = this.body.leftLeg.clone()
          const rLeg = this.body.rightLeg.clone()

          this.otherLegs.push(lLeg)
          this.otherLegs.push(rLeg)

          rLeg.position.set(0, i * 0.2, -i * 0.5)
          lLeg.position.set(0, i * 0.2, -i * 0.5)

          this.body.body.add(lLeg)
          this.body.body.add(rLeg)
        }
      }

      if (this.ADN.morphology.arms <= 0.1) {
        this.body.leftArm.visible = false
        this.body.rightArm.visible = false
      } else {
        const armsSize = this.ADN.morphology.arms * 2 + 0.001 * (this.ADN.morphology.nArms <= 0.25 ? 0 : 1)
        this.body.leftArm.scale.set(armsSize, armsSize, armsSize)
        this.body.rightArm.scale.set(armsSize, armsSize, armsSize)

        this.otherArms = []
        for (let i = 0; i < Math.floor(4 * this.ADN.morphology.nArms) - 1; i++) {
          const lArm = this.body.leftArm.clone()
          const rArm = this.body.rightArm.clone()

          this.otherArms.push(lArm)
          this.otherArms.push(rArm)

          rArm.position.set(0, i * 0.2, -i * 0.5)
          lArm.position.set(0, i * 0.2, -i * 0.5)

          this.body.body.add(lArm)
          this.body.body.add(rArm)
        }
      }

      if (this.ADN.morphology.tail <= 0.1) {
        this.body.tail.visible = false
      } else {
        const tailSize = this.ADN.morphology.tail * 2 + 0.001
        this.body.tail.scale.set(tailSize, tailSize, tailSize)
      }

      if (this.ADN.capacity.fly <= 0.1) {
        this.body.leftWing.visible = false
        this.body.rightWing.visible = false
      } else {
        const wingsSize = this.ADN.capacity.fly * 2 + 0.001
        this.body.leftWing.scale.set(wingsSize, wingsSize, wingsSize)
        this.body.rightWing.scale.set(wingsSize, wingsSize, wingsSize)
      }

      this.minBody = new Mesh(new SphereBufferGeometry(this.effectiveSize, 3, 3), material)
      this.minBody.visible = false
      this.add(this.minBody)

      const self = this
      this.body.traverse((el) => {
        if (el.isMesh) {
          el.material = material
          el.material.uniforms.uColor.value = self.ADN.morphology.color
        }
      })
    } else {
      const geometry = new SphereBufferGeometry(this.effectiveSize, 3, 3)
      this.body = new Mesh(geometry, material)
    }
    this.add(this.body)

    this.timer = 0
    this.previous = 0
    this.timeSeed = utils.randint(0, 100)
  }

  getSpeed () {
    const speed = (this.ADN.capacity.fly * 0.3 + this.ADN.morphology.size * 0.2 + this.ADN.morphology.legs * 0.2 - this.ADN.morphology.weight * 0.2) * (Math.sin(this.age * Math.PI) + 0.2) * 0.2
    return (speed > 0 ? speed : 0.001) * constants.TIME.SPEED
  }

  increaseHunger () {
    this.hunger += (this.ADN.morphology.size + this.ADN.morphology.weight * 0.5 + this.ADN.reproduction.interval + this.ADN.reproduction.litter * 0.5) * 0.004 * constants.TIME.SPEED
  }

  increaseDesire () {
    this.desire += this.ADN.reproduction.interval * 0.001 * constants.TIME.SPEED
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
    this.effectiveSize = this.age * this.ADN.morphology.size * 2 + 0.2
    this.body.scale.set(this.effectiveSize, this.effectiveSize, this.effectiveSize)
    this.minBody.scale.set(this.effectiveSize * 8, this.effectiveSize * 8, this.effectiveSize * 8)
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

  update (webgl, posCam) {
    if (this.isAlive()) {
      this.increaseHunger()
      this.increaseDesire()
      this.increaseDirection()
      this.updateSuitsCoeff(webgl)
      this.increaseAge()
      this.increaseEffectiveSize()
      if (this.virus) {
        this.getClosest(webgl.getOthers(this))
      }

      const camdist = posCam.distanceTo(this.position)

      if (camdist < 100) {
        this.body.traverse((el) => {
          if (el.material) el.material.uniforms.uDay.value = Math.sin(webgl.currentTime * 0.01)
        })
        if (!this.body.visible) this.body.visible = true
        if (this.minBody.visible) this.minBody.visible = false
        this.animate(webgl)
      } else if (camdist < 500) {
        this.minBody.material.uniforms.uDay.value = Math.sin(webgl.currentTime * 0.01)
        if (!this.minBody.visible) this.minBody.visible = true
        if (this.body.visible) this.body.visible = false
      } else if (this.body.visible) {
        this.body.visible = false
      } else if (this.minBody.visible) {
        this.minBody.visible = false
      }

      this.timer++
    }
  }

  getClosest (array) {
    const distances = []
    array.forEach((element) => {
      const dist = this.position.distanceTo(element.position)
      if (element.type === constants.RESSOURCES.TYPES.MEAT && (this.virus && !element.virus) && dist < this.virus.distance && Math.random() < this.virus.transmission) {
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
        const diet = this.clamp((Math.random() * this.ADN.diet.carnivorous), 0, 1) // le random à revoir
        const others = webgl.getOthers(this, this.uneatableEx)
        if (diet > 0.5) {
          this.focus = this.getClosest(others)
        } else {
          this.focus = this.getClosest(webgl.ground.getVegetation(this))
        }
      } else {
        this.focus = null
      }
    } else {
      const others = webgl.getOthers(this, this.unfuckableEx)
      if (others.length !== 0) {
        this.focus = this.getClosest(others)
      } else {
        this.focus = null
      }
    }
  }

  updateFocus (webgl) {
    if (this.focus.element && this.focus.element.isAlive()) {
      this.focus.distance = this.position.distanceTo(this.focus.element.position)
    } else {
      this.findFocus(webgl)
    }
  }

  handleDesire (webgl) {
    this.handleReproduction(webgl)
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
    if (this.virus && Math.random() > this.virus.steril) return false
    if (this.focus.element.virus && Math.random() > this.focus.element.virus.steril) return false
    const rand = Math.random()
    const n = Math.round(this.ADN.reproduction.litter * 10 * rand)
    for (let i = 0; i < n; i++) {
      const newADN = this.ADN.getADNFromReproductionWith(this.focus.element.ADN)
      webgl.addFellow(new Fellow({ ADN: newADN, object: this.body }), this.position)
    }
    return true
  }

  handleHunger (webgl) {
    if (this.focus.element.type === constants.RESSOURCES.TYPES.MEAT) {
      if (!this.ADN.canFuckWith(this.focus.element.ADN)) {
        webgl.removeFellow(this.focus.element)
        this.hunger = 0
      } else {
        this.uneatableEx.push(this.focus.element)
      }
    } else if (this.focus.element.type === constants.RESSOURCES.TYPES.VEGETATION) {
      this.hunger = 0
      webgl.ground.eatTree(this.focus.element)
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
    virus.evolve()
    this.body.traverse((el) => {
      if (el.material) {
        el.material.uniforms.uVirus.value = 1.0
      }
    })
    this.minBody.material.uniforms.uVirus.value = 1.0
    this.virus = virus
  }

  move (webgl) {
    if (this.isAlive()) {
      if ((this.canFuck(webgl) || this.canEat(webgl))) {
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
      this.position.y = webgl.ground.getHeight(this.position.x, this.position.z) - 0.1 + this.ADN.morphology.legs + (this.minBody.visible ? 1 : 0)// + (this.ADN.capacity.fly > 0 ? this.flyingTime(webgl.currentTime) * this.ADN.capacity.fly * 50 : 0)

      webgl.updatePosition(this)
    }
  }

  flyingTime (t) {
    return Math.abs(Math.sin(((t + this.flyingOffset) * 0.001) / this.ADN.capacity.fly))
  }

  animate (webgl) {
    const t = (webgl.currentTime + this.timeSeed) * 0.1

    if (this.ADN.morphology.tail > 0.1) {
      this.body.tail.rotation.y = Math.sin(t) * 0.2 * this.desire * 0.3
    }

    if (this.ADN.morphology.legs > 0.1) {
      this.body.leftLeg.rotation.x = Math.sin(t * this.getSpeed() * 3) * 0.2
      this.body.rightLeg.rotation.x = Math.sin(t * this.getSpeed() * 3 + Math.PI) * 0.2

      for (let i = 0; i < this.otherLegs.length; i++) {
        this.otherLegs[i].rotation.x = Math.sin(t * this.getSpeed() * 3 + (i % 2 === 0 ? 0 : Math.PI) + i * 0.5) * 0.2
      }
    }

    if (this.ADN.morphology.arms > 0.1) {
      this.body.leftArm.rotation.x = Math.sin(t * this.getSpeed()) * 0.3
      this.body.rightArm.rotation.x = Math.sin(t * this.getSpeed() + Math.PI) * 0.3

      for (let i = 0; i < this.otherArms.length; i++) {
        this.otherArms[i].rotation.x = Math.sin(t * this.getSpeed() * 3 + (i % 2 === 0 ? 0 : Math.PI) + i * 0.5) * 0.2
      }
    }

    if (this.ADN.capacity.fly > 0.1) {
      this.body.leftWing.rotation.z = Math.sin(t * 6 * (1 - this.ADN.capacity.fly)) * 0.2
      this.body.rightWing.rotation.z = -Math.sin(t * 6 * (1 - this.ADN.capacity.fly)) * 0.2
    }

    if (this.ADN.morphology.neck > 0.1) {
      this.body.neck.rotation.y = Math.sin(t * 2) * 0.1
      this.body.neck.rotation.x = Math.sin(t * 2) * 0.1 * this.hunger
    }

    if (this.ADN.morphology.head > 0.1) {
      this.body.head.rotation.z = Math.sin(t * 2) * 0.1
    }
  }

  handleDeath (webgl) {
    if (this.isAlive() && (this.hunger >= 2 || this.age >= 1)) {
      webgl.removeFellow(this)
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
    return str
  }

  displayInfo () {
    let str = '<h1>Fellow (' + this.firstname + ')</h1>'
    str += '<div id="info_update">' + this.infoToUpdate() + '</div>'
    str += '<h2>ADN</h2>'
    str += this.ADN.toString()
    if (this.virus) {
      str += '<h2>Virus</h2>'
      str += this.virus.toString()
    }

    document.getElementById('info').innerHTML = str
    document.getElementById('info').style.animation = '0.5s show forwards'
  }

  updateInfo () {
    document.getElementById('info_update').innerHTML = this.infoToUpdate()
  }

  infoToUpdate () {
    let str = ''
    str += '<p>age<b>' + utils.virg(this.age, 3) + '</b></p>'
    str += '<p>desire<b>' + utils.virg(this.desire, 3) + '</b></p>'
    str += '<p>hunger<b>' + utils.virg(this.hunger, 3) + '</b></p>'
    str += '<p>longevity<b>' + utils.virg(this.ADN.capacity.longevity, 3) + '</b></p>'
    str += '<p>speed<b>' + utils.virg(this.getSpeed(), 3) + '</b></p>'
    str += '<p>is alive<b>' + (this.isAlive() ? 'yes' : 'no') + '</b></p>'

    return str
  }
}
