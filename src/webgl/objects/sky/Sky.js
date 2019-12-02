import { Object3D, IcosahedronBufferGeometry, RawShaderMaterial, Mesh/* , DoubleSide */, BackSide, MeshBasicMaterial } from 'three'

import constants from 'utils/constants'
// import utils from 'utils/utils'

import vertexShader from './shaders/sky.vs'
import fragmentShader from './shaders/sky.fs'

export default class Sky extends Object3D {
  constructor () {
    super()

    this.geometry = new IcosahedronBufferGeometry(constants.GROUND.SIZE, 3)

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
        },
        uMoonX: {
          value: 0.0
        },
        uMoonY: {
          value: 0.0
        },
        uMoonZ: {
          value: 0.0
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: BackSide
      // wireframe: true
    })

    this.sun = new Mesh(new IcosahedronBufferGeometry(10, 2), new MeshBasicMaterial({ color: 0xffff66 }))
    this.moon = new Mesh(new IcosahedronBufferGeometry(5, 2), new MeshBasicMaterial({ color: 0xaaaaaa }))
    this.add(this.sun)
    this.add(this.moon)

    this.sphere = new Mesh(this.geometry, this.material)
    this.add(this.sphere)
  }

  isAlive () {
    return true
  }

  update (time) {
    this.material.uniforms.uTime.value += time
    this.material.uniforms.uDay.value = Math.sin(time)

    this.material.uniforms.uSunX.value = this.sun.position.x
    this.material.uniforms.uSunY.value = this.sun.position.y
    this.material.uniforms.uSunZ.value = this.sun.position.z

    this.material.uniforms.uMoonX.value = this.moon.position.x
    this.material.uniforms.uMoonY.value = this.moon.position.y
    this.material.uniforms.uMoonZ.value = this.moon.position.z

    this.sun.position.set(
      Math.cos(time) * (constants.GROUND.SIZE * 0.6),
      Math.sin(time) * (constants.GROUND.SIZE * 0.6),
      Math.sin(time) * constants.GROUND.SIZE * Math.abs(Math.sin(time / 300)))
    this.moon.position.set(
      -Math.cos(time) * (constants.GROUND.SIZE * 0.6),
      -Math.sin(time) * (constants.GROUND.SIZE * 0.6),
      -Math.sin(time) * constants.GROUND.SIZE * Math.abs(Math.sin(time / 300)))
  }
}
