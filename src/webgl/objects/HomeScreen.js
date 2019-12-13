import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AmbientLight
} from 'three'

import MyLittlePlanet from './myLittlePlanet/MyLittlePlanet'

export default class mapSimulator {
  constructor ($parent) {
    this.render = this.render.bind(this)
    this.renderer = new WebGLRenderer({
      antialias: true
    })
    this.renderer.setClearColor(0x333333, 1)
    this.renderer.preserveDrawingBuffer = true
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    $parent.appendChild(this.renderer.domElement)

    this.scene = new Scene()

    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 100, 100)
    this.scene.add(this.camera)
    this.scene.background = new Color(0x111)

    const ambient = new AmbientLight(0x666666)
    this.scene.add(ambient)

    this.planet = new MyLittlePlanet()
    this.scene.add(this.planet)

    this.render()
    window.addEventListener('resize', this.onResize.bind(this), false)
    window.addEventListener('mousemove', this.mouseHandler.bind(this), false)
  }

  onResize () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  render () {
    this.planet.update()
    requestAnimationFrame(this.render)
    this.renderer.render(this.scene, this.camera)
  }

  clamp (v, a, b) {
    if (v < a) return a
    if (v > b) return b
    return v
  }

  mouseHandler (e) {
    const x = (e.clientX - (window.innerWidth / 2)) * 0.03
    const y = (e.clientY - (window.innerHeight / 2)) * 0.03
    this.planet.position.set(x, 100 - y, 0)
    // this.planetPositionX = e.clientX
    // this.planetPositionY = e.clientY
  }
}
