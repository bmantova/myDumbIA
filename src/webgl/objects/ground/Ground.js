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

    this.geometry = new PlaneBufferGeometry(constants.GROUND.SIZE, constants.GROUND.SIZE, constants.GROUND.SUB, constants.GROUND.SUB)

    this.material = new RawShaderMaterial({
      uniforms: {},
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: DoubleSide,
      wireframe: true
    })

    const vertices = this.geometry.attributes.position.array

    /* for (let i = 0; i < vertices.length; i++) {
      vertices[i * 3 + 2] = this.height.get((i * 3) % (constants.GROUND.SUB + 1) + 3, Math.floor((i * 3) / (constants.GROUND.SUB + 1))) * 10
    } */

    for (let i = 0; i <= constants.GROUND.SUB; i++) {
      for (let j = 0; j <= constants.GROUND.SUB; j++) {
        vertices[(i * (constants.GROUND.SUB + 1) + j) * 3 + 2] = this.height.get(j, -i) * 10
      }
    }

    var plane = new Mesh(this.geometry, this.material)

    plane.rotation.x = Math.PI * 0.5
    plane.rotation.z = Math.PI
    this.add(plane)

    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * constants.GROUND.SIZE
      const y = (Math.random() - 0.5) * constants.GROUND.SIZE
      this.add(new Vegetation({ size: 3, position: new Vector3(x, this.getHeight(x, y) - 3, y) }))
    }
  }

  getHeight (x, y) {
    const ratio = (constants.GROUND.SUB) / constants.GROUND.SIZE
    return this.height.get((x - constants.GROUND.SIZE * 0.5) * ratio, (-y - constants.GROUND.SIZE * 0.5) * ratio) * 10
  }

  update (time) {
    // this.rotateY(0.04)
    // this.material.uniforms.uTime.value += 0.01
    // this.material.uniforms.uAmplitude.value = audio.volumeconst vertices = geometry.attributes.position.array
  }
}
