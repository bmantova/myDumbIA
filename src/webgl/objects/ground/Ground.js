import { Object3D, PlaneBufferGeometry, RawShaderMaterial, Mesh, Vector3, BackSide } from 'three'

import constants from 'utils/constants'
import utils from 'utils/utils'

import vertexShader from './shaders/ground.vs'
import fragmentShader from './shaders/ground.fs'

import underVertexShader from './shaders/under.vs'
import underFragmentShader from './shaders/under.fs'
import Map from './Map'
import Vegetation from '../Vegetation'
import Sky from '../sky/Sky.js'
// import { OBJLoader } from './loader/OBJLoader.js'

/* Chutes d'eau */

export default class Ground extends Object3D {
  constructor (size) {
    super()

    this.height = new Map(constants.GROUND.MAPS.HEIGHT)
    this.humidity = new Map(constants.GROUND.MAPS.HUMIDITY)
    this.temperature = new Map(constants.GROUND.MAPS.TEMPERATURE)

    this.geometry = new PlaneBufferGeometry(constants.GROUND.SIZE, constants.GROUND.SIZE, constants.GROUND.SUB, constants.GROUND.SUB)
    this.underGeometry = new PlaneBufferGeometry(constants.GROUND.SIZE, constants.GROUND.SIZE, constants.GROUND.SUB, constants.GROUND.SUB)

    this.material = new RawShaderMaterial({
      uniforms: {
        uTime: {
          value: 0.0
        },
        uDay: {
          value: 0.0
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
      // side: DoubleSide
      // wireframe: true
    })
    this.underMaterial = new RawShaderMaterial({
      uniforms: {
        uTime: {
          value: 0.0
        },
        uDay: {
          value: 0.0
        }
      },
      vertexShader: underVertexShader,
      fragmentShader: underFragmentShader,
      side: BackSide
      // wireframe: true
    })

    const vertices = this.geometry.attributes.position.array
    const verticesUnder = this.underGeometry.attributes.position.array

    for (let i = 0; i <= constants.GROUND.SUB; i++) {
      for (let j = 0; j <= constants.GROUND.SUB; j++) {
        const index = (i * (constants.GROUND.SUB + 1) + j) * 3 + 2
        vertices[index] = this.height.get(j, i) * 10
        if (i === 0 || j === 0 || i === constants.GROUND.SUB || j === constants.GROUND.SUB) {
          let h = this.height.get(j, i) * 10
          h = h > 0 ? h : 0
          verticesUnder[index] = h
        } else {
          const x = constants.GROUND.SUB / 2 - i
          const y = constants.GROUND.SUB / 2 - j
          const mult = constants.GROUND.SUB * 1.4142 * 0.5 - Math.sqrt((x * x) + (y * y))
          verticesUnder[index] = utils.randint(-mult * mult * 0.02, -mult)
        }
      }
    }

    this.plane = new Mesh(this.geometry, this.material)
    this.under = new Mesh(this.underGeometry, this.underMaterial)

    this.plane.rotation.x = -Math.PI * 0.5
    this.plane.rotation.z = Math.PI
    this.add(this.plane)

    this.under.rotation.x = -Math.PI * 0.5
    this.under.rotation.z = Math.PI
    this.add(this.under)

    this.add(new Sky())

    this.vegetation = []
    for (let i = 0; i < 0; i++) {
      this.addRandomVegetation()
    }
  }

  getHeight (x, y) {
    const ratio = (constants.GROUND.SUB) / constants.GROUND.SIZE
    return this.height.get((x - constants.GROUND.SIZE * 0.5) * ratio, (y - constants.GROUND.SIZE * 0.5) * ratio) * 10
  }

  getBiomeInfo (x, y) {
    return {
      height: this.getHeight(x, y),
      humidity: this.humidity.get(x, y),
      temperature: this.temperature.get(x, y)
    }
  }

  update (time) {
    // this.rotateY(0.01)
    const timeMult = 0.01 * constants.TIME.SPEED

    this.material.uniforms.uTime.value += timeMult
    this.material.uniforms.uDay.value = Math.sin(time * timeMult)

    this.underMaterial.uniforms.uTime.value += timeMult
    this.underMaterial.uniforms.uDay.value = Math.sin(time * timeMult)

    this.children.forEach((child) => {
      if (child.update) {
        if (child.isAlive()) child.update(time * timeMult)
        else {
          this.addVegetationFromParent(child, time)
          this.remove(child)
        }
      }
    })
    utils.debug('time', time)
  }

  removeTree (elem) {
    this.remove(elem)
    this.vegetation = this.vegetation.filter((el) => el.id !== elem.id)
  }

  addRandomVegetation () {
    let x
    let y
    let essais = 0
    let next = true
    while (essais < 5 && next) {
      x = utils.randfloat(-constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)
      y = utils.randfloat(-constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)

      if (this.getHeight(x, y) > 5) next = false

      essais++
    }

    this.addVegetation(x, y)
  }

  addVegetation (x, y) {
    const veg = new Vegetation({ position: new Vector3(x, this.getHeight(x, y), y), life: utils.randint(500, 1000), born: Math.floor(Math.random() * -500), biome: this.getBiomeInfo(x, y) })
    this.vegetation.push(veg)
    this.add(veg)
  }

  addVegetationFromParent (parent, time) {
    const n = Math.round(utils.randint(0, constants.RESSOURCES.VEGETATION.FALLING_TIME))
    for (let i = 0; i < n; i++) {
      const x = utils.limit(parent.position.x + utils.randfloat(0, parent.size), -constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)
      const y = utils.limit(parent.position.z + utils.randfloat(0, parent.size), -constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)
      this.addVegetation(x, y)
    }
  }
}
