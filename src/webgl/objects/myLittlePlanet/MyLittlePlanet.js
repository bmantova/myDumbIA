import { Object3D, RawShaderMaterial, Mesh, IcosahedronBufferGeometry } from 'three'
import vertexShader from './shaders/planet.vs'
import fragmentShader from './shaders/planet.fs'

export default class MyLittlePlanet extends Object3D {
  constructor (size) {
    super()

    this.geometry = new IcosahedronBufferGeometry(40, 4)

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
    })

    this.planet = new Mesh(this.geometry, this.material)
    this.position.y = 100

    this.add(this.planet)
    this.time = 0
  }

  isAlive () {
    return true
  }

  update () {
    this.time++
    const timeMult = 0.01

    this.rotation.y += 0.001
    this.rotation.x += 0.001

    this.material.uniforms.uTime.value = this.time * timeMult
    this.material.uniforms.uDay.value = Math.sin(this.time * timeMult)
  }
}
