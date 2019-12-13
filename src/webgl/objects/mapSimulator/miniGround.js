import {
  Object3D,
  PlaneBufferGeometry,
  RawShaderMaterial,
  Mesh
} from 'three'

import vs from './shaders/ground.vs'
import fs from './shaders/ground.fs'

export default class miniGround extends Object3D {
  constructor (size) {
    super()
    this.size = 200
    this.subdivision = 200
    this.geometry = new PlaneBufferGeometry(this.size, this.size, this.subdivision, this.subdivision)

    this.material = new RawShaderMaterial({
      uniforms: {
        uHeight: {
          value: 0.0
        },
        uTemperature: {
          value: 0.0
        },
        uHumidity: {
          value: 0.0
        },
        vertexShader: vs,
        fragmentShader: fs
      }
    })

    this.plane = new Mesh(this.geometry, this.material)
    this.add(this.plane)
  }
}
