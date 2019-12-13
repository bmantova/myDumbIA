import { Object3D, PlaneBufferGeometry, RawShaderMaterial, Mesh, Vector3, BackSide } from 'three'

import constants from 'utils/constants'
import utils from 'utils/utils'

import vertexShader from './shaders/ground.vs'
import fragmentShader from './shaders/ground.fs'

import underVertexShader from './shaders/under.vs'
import underFragmentShader from './shaders/under.fs'
import Map from './Map'
import Vegetation from '../Vegetation'
import Sky from '../sky/Sky'

// import MyLittlePlanet from '../myLittlePlanet/MyLittlePlanet'
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
        },
        uSunX: {
          value: 0.0
        },
        uSunY: {
          value: 0.0
        },
        uSunZ: {
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
        vertices[index] = this.height.get(j, i, true) * 10
        this.humidity.get(j, i, true)
        this.temperature.get(j, i, true)
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

    this.geometry.computeVertexNormals()

    this.plane = new Mesh(this.geometry, this.material)
    this.under = new Mesh(this.underGeometry, this.underMaterial)

    this.plane.rotation.x = -Math.PI * 0.5
    this.plane.rotation.z = Math.PI
    this.add(this.plane)

    this.under.rotation.x = -Math.PI * 0.5
    this.under.rotation.z = Math.PI
    this.add(this.under)

    this.sky = new Sky()

    this.add(this.sky)

    // this.add(new MyLittlePlanet())

    this.vegetation = []
    for (let i = 0; i < 500; i++) {
      this.addRandomVegetation()
    }
  }

  getHeight (x, y) {
    const coords = this.getTrueHeightCoords(x, y)
    return this.height.get(coords.x, coords.y) * 10
  }

  getTrueHeightCoords (x, y) {
    const ratio = (constants.GROUND.SUB) / constants.GROUND.SIZE
    return { x: (x - constants.GROUND.SIZE * 0.5) * ratio, y: (y - constants.GROUND.SIZE * 0.5) * ratio }
  }

  getBiomeInfo (x, y) {
    const coords = this.getTrueHeightCoords(x, y)
    return {
      height: this.height.mappedValue(coords.x, coords.y),
      humidity: this.humidity.mappedValue(x, y),
      temperature: this.temperature.mappedValue(x, y)
    }
  }

  removeTree (elem) {
    this.remove(elem)
    this.vegetation = this.vegetation.filter((el) => el !== elem)
  }

  addRandomVegetation () {
    let x
    let y
    let essais = 0
    let next = true
    while (essais < 3 && next) {
      x = utils.randfloat(-constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)
      y = utils.randfloat(-constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)

      if (this.getHeight(x, y) > 5) next = false

      essais++
    }

    this.addVegetation(x, y, Math.floor(Math.random() * constants.RESSOURCES.VEGETATION.MAX_LIFE / 2))
  }

  addVegetation (x, y, born = 1) {
    const veg = new Vegetation({ position: new Vector3(x, this.getHeight(x, y), y), life: utils.randint(constants.RESSOURCES.VEGETATION.MAX_LIFE / 2, constants.RESSOURCES.VEGETATION.MAX_LIFE), born: born, biome: this.getBiomeInfo(x, y) })
    this.vegetation.push(veg)
    this.add(veg)
  }

  addVegetationFromParent (parent) {
    const n = Math.round(utils.randint(0, constants.RESSOURCES.VEGETATION.MAX_TREES / this.vegetation.length))
    const zone = parent.size * 50

    for (let i = 0; i < n; i++) {
      const x = utils.loopLimit(parent.position.x + utils.randfloat(-zone, zone), -constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)
      const y = utils.loopLimit(parent.position.z + utils.randfloat(-zone, zone), -constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)
      this.addVegetation(x, y)
    }
  }

  update (time) {
    const timeMult = 0.01

    this.material.uniforms.uTime.value = time * timeMult
    this.material.uniforms.uDay.value = Math.sin(time * timeMult)

    this.underMaterial.uniforms.uDay.value = Math.sin(time * timeMult)

    this.material.uniforms.uSunX.value = this.sky.sun.position.x
    this.material.uniforms.uSunY.value = this.sky.sun.position.y
    this.material.uniforms.uSunZ.value = this.sky.sun.position.z

    this.children.forEach((child) => {
      if (child.update) {
        if (child.isAlive()) {
          child.update(time * timeMult)
          if (child.canHaveChild) {
            child.haveChild()
            this.addVegetationFromParent(child)
          }
        } else {
          this.addVegetationFromParent(child)
          this.removeTree(child)
        }
      }
    })
    // utils.debug('time', time * constants.TIME.SPEED)
    utils.debug('day', Math.floor(time * timeMult / (Math.PI * 2)))
    utils.debug('#trees', this.vegetation.length)
  }
}
