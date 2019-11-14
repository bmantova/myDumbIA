import { Object3D, PlaneBufferGeometry, RawShaderMaterial, Mesh, DoubleSide } from 'three'

import vertexShader from './shaders/ground.vs'
import fragmentShader from './shaders/ground.fs'

export default class Ground extends Object3D {
  constructor (size) {
    super()
    const geometry = new PlaneBufferGeometry(size, size, 512, 512)

    this.material = new RawShaderMaterial({
      uniforms: {
        uWave: { value: 40.0 },
        uVelocity: { value: 10.0 },
        uAmplitude: { value: 3.0 },
        uTime: { value: 1.0 }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: DoubleSide
    })
    var plane = new Mesh(geometry, this.material)

    plane.rotation.x = Math.PI * 0.5
    // this.add(plane)
  }

  onBeat (audio) {
    // this.material.uniforms.uAmplitude.value = audio.volume
  }

  update (audio) {
    this.material.uniforms.uTime.value += 0.01
    // this.material.uniforms.uAmplitude.value = audio.volume
  }
}
