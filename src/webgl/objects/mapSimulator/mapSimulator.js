import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AmbientLight,
  DirectionalLight,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three'

import {
  OrbitControls
} from '../../controls/OrbitControls'

// import { datGui } from 'utils/debug'

import Ground from './miniGround'

export default class mapSimulator {
  constructor ($parent) {
    this.render = this.render.bind(this)
    this.width = 400
    this.height = 200
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
    this.camera.position.set(0, 150, 400)
    this.scene.add(this.camera)
    this.scene.background = new Color(0x111)

    // const folder = datGui.addFolder('Composer')
    /* folder.add(params, 'scale').min(0).max(1).onChange((value) => {
      bloomEffect.scale = value
    }) */

    const ambient = new AmbientLight(0x666666)
    this.scene.add(ambient)

    const light = new DirectionalLight(0xffffff, 1)
    this.scene.add(light)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.ground = new Ground()
    this.scene.add(this.ground)

    var geometry = new BoxGeometry(1, 1, 1)
    var material = new MeshBasicMaterial({ color: 0x00ff00 })
    var cube = new Mesh(geometry, material)
    this.scene.add(cube)

    // this.camera.position.z = 5

    this.render()
  }

  update (time) {
    this.light.position.y = Math.cos(time * 0.02) * 20
    this.light.position.x = Math.sin(time * 0.02) * 20
  }

  render () {
    requestAnimationFrame(this.render)
    this.renderer.render(this.scene, this.camera)
  }
}
