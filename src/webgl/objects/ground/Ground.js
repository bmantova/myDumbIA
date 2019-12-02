import { Object3D, PlaneBufferGeometry, RawShaderMaterial, Mesh/* , DoubleSide */, Vector3, BackSide } from 'three'

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

    /* for (let i = 0; i < vertices.length; i++) {
      vertices[i * 3 + 2] = this.height.get((i * 3) % (constants.GROUND.SUB + 1) + 3, Math.floor((i * 3) / (constants.GROUND.SUB + 1))) * 10
    } */

    for (let i = 0; i <= constants.GROUND.SUB; i++) {
      for (let j = 0; j <= constants.GROUND.SUB; j++) {
        const index = (i * (constants.GROUND.SUB + 1) + j) * 3 + 2
        vertices[(i * (constants.GROUND.SUB + 1) + j) * 3 + 2] = this.height.get(j, i) * 10
        if (i === 0 || j === 0 || i === constants.GROUND.SUB || j === constants.GROUND.SUB) {
          verticesUnder[index] = this.height.get(j, i) * 10
        } else {
          verticesUnder[index] = utils.randint(-20, 0)
        }
      }
    }

    this.plane = new Mesh(this.geometry, this.material)

    this.plane.rotation.x = -Math.PI * 0.5
    this.plane.rotation.z = Math.PI
    this.add(this.plane)

    this.add(new Sky())

    for (let i = 0; i < 500; i++) {
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

      const size = Math.abs(this.humidity.get(x, y) + 3)
      this.add(new Vegetation({ size: size, position: new Vector3(x, this.getHeight(x, y), y), life: utils.randint(500, 1000), born: Math.floor(Math.random() * -500) }))
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
    const timeMult = 0.01

    this.material.uniforms.uTime.value += timeMult
    this.material.uniforms.uDay.value = Math.sin(time * timeMult)
    this.children.forEach((child) => {
      if (child.update) {
        if (child.isAlive()) child.update(time * timeMult)
        else {
          const x = utils.limit(child.position.x + utils.randfloat(0, child.size), -constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)
          const y = utils.limit(child.position.z + utils.randfloat(0, child.size), -constants.GROUND.SIZE / 2, constants.GROUND.SIZE / 2)
          this.add(new Vegetation({ size: child.size + utils.randfloat(-1, 1), position: new Vector3(x, this.getHeight(x, y), y), life: child.life + utils.randfloat(-10, 10), born: time }))
          this.remove(child)
        }
      }
    })
    utils.debug('time', time)
  }

  removeTree (elem) {
    this.remove(elem)
  }
}
