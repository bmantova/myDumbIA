import {
  Object3D,
  MeshBasicMaterial,
  SphereBufferGeometry,
  Mesh,
  BoxBufferGeometry,
  TorusBufferGeometry,
  ConeBufferGeometry
} from 'three'

export default class Bobby extends Object3D {
  constructor (options = {}) {
    super()
    this.material = options.material || new MeshBasicMaterial({ color: 0x00ff00 })

    this.shapes = ['cube', 'sphere', 'torus', 'cone']
    this.shape = options.shape || this.shapes[Math.floor(Math.random() * (this.shapes.length))]

    this.init()
  }

  init () {
    let geom
    switch (this.shape) {
      case 'sphere':
        geom = new SphereBufferGeometry(1, 32, 32)
        break
      case 'torus':
        geom = new TorusBufferGeometry(1, 0.5, 4, 20)
        break
      case 'cone':
        geom = new ConeBufferGeometry(1, 1, 10)
        break
      default:
        geom = new BoxBufferGeometry(1, 1, 1)
        break
    }

    this.mesh = new Mesh(geom, this.material)

    this.add(this.mesh)
  }

  update (time) {
  }
}
