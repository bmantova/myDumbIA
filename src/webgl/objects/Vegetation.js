import {
  MeshStandardMaterial,
  Color,
  BoxBufferGeometry,
  Mesh
} from 'three'

import Ressource from './Ressource'

export default class Vegetation extends Ressource {
  constructor (options = {}) {
    super(options)

    this.init()
    const material = new MeshStandardMaterial({ color: new Color(0x33BB55), roughness: 1 })
    const box = new BoxBufferGeometry(1, this.size, 1)

    const mesh = new Mesh(box, material)

    this.add(mesh)
  }

  init () {
  }

  update (time) {
  }
}
