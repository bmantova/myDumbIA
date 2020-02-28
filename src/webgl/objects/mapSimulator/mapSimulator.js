import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color
} from 'three'

import {
  OrbitControls
} from '../../controls/OrbitControls'

import * as dat from 'dat.gui'

import Ground from '../ground/Ground'

export default class mapSimulator {
  constructor ($parent) {
    this.render = this.render.bind(this)
    this.width = 1000
    this.height = 300
    this.renderer = new WebGLRenderer({
      antialias: true
    })
    this.renderer.setClearColor(0x333333, 1)
    this.renderer.preserveDrawingBuffer = true
    this.renderer.setSize(this.width, this.height)

    $parent.appendChild(this.renderer.domElement)

    this.scene = new Scene()

    this.camera = new PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      2000
    )
    this.camera.position.set(0, 60, 150)
    this.scene.add(this.camera)
    this.scene.background = new Color(0x111)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.ground = new Ground()
    this.scene.add(this.ground)

    this.datGui = new dat.GUI({ autoPlace: false })
    var customContainer = document.getElementById('datGui')
    customContainer.appendChild(this.datGui.domElement)

    const params = {
      humidity: 0.0,
      temperature: 0.0,
      height: 1.0
    }
    const self = this
    this.datGui.add(params, 'humidity').min(0).max(1).step(0.1).onChange((value) => {
      self.ground.material.uniforms.uHumidity.value = value
    })
    this.datGui.add(params, 'temperature').min(-1).max(1).step(0.1).onChange((value) => {
      self.ground.material.uniforms.uTemperature.value = value
    })
    this.datGui.add(params, 'height').min(0).max(4).step(0.1).onChange((value) => {
      self.ground.material.uniforms.uHeight.value = value
    })

    this.time = 0
    this.render()
  }

  update (time) {
    this.ground.update(time)
  }

  render () {
    this.time += 0.1
    this.update(this.time)
    requestAnimationFrame(this.render)
    this.renderer.render(this.scene, this.camera)
  }
}
