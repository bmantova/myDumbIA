import { Object3D, PlaneBufferGeometry, RawShaderMaterial, Mesh, DoubleSide, Vector3 } from 'three'

import constants from 'utils/constants'

import vertexShader from './shaders/ground.vs'
import fragmentShader from './shaders/ground.fs'

import Map from './Map'
import Vegetation from '../Vegetation'

export default class Ground extends Object3D {
  constructor (size) {
    super()

    this.height = new Map(constants.GROUND.MAPS.HEIGHT)
    this.humidity = new Map(constants.GROUND.MAPS.HUMIDITY)
    this.temperature = new Map(constants.GROUND.MAPS.TEMPERATURE)

    this.geometry = new PlaneBufferGeometry(constants.GROUND.SIZE, constants.GROUND.SIZE, constants.GROUND.SUB, constants.GROUND.SIZE)

    this.material = new RawShaderMaterial({
      uniforms: {},
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: DoubleSide
    })

    const vertices = this.geometry.attributes.position.array

    for (let i = 0; i < vertices.length; i++) {
      vertices[i * 3 + 2] = this.height.get(i % constants.GROUND.SUB, Math.floor(i / constants.GROUND.SUB)) * 10
    }

    var plane = new Mesh(this.geometry, this.material)

    plane.rotation.x = Math.PI * 0.5

    this.add(plane)
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * constants.GROUND.SIZE - constants.GROUND.SIZE / 2
      const y = Math.random() * constants.GROUND.SIZE - constants.GROUND.SIZE / 2
      this.add(new Vegetation({ size: 3, position: new Vector3(x, this.getHeight(x, y), y) }))
    }
  }

  getHeight (x, y) {
    const ratio = constants.GROUND.SIZE / constants.GROUND.SUB
    return this.height.get(y * ratio - constants.GROUND.SIZE / 2, x * ratio - constants.GROUND.SUB) * 10
  }

  update (time) {
    // this.material.uniforms.uTime.value += 0.01
    // this.material.uniforms.uAmplitude.value = audio.volumeconst vertices = geometry.attributes.position.array
  }
}
