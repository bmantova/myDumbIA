import {
  MeshStandardMaterial,
  Color,
  BoxBufferGeometry,
  IcosahedronBufferGeometry,
  Mesh
} from 'three'

/** Idée
 Algo génétique pour les plantes
*/

import Ressource from './Ressource'

export default class Vegetation extends Ressource {
  constructor (options = {}) {
    super(options)

    this.init()
    const materialTronc = new MeshStandardMaterial({ color: new Color(0xBB5533), roughness: 1 })
    const box = new BoxBufferGeometry(this.size * 0.1, this.size * 0.5, this.size * 0.1)

    const materialFeuilles = new MeshStandardMaterial({ color: new Color(0x55BB33), roughness: 1 })
    const feuillesGeom = new IcosahedronBufferGeometry(this.size * 0.5)

    const tronc = new Mesh(box, materialTronc)
    const feuilles = new Mesh(feuillesGeom, materialFeuilles)

    tronc.position.y += this.size * 0.5
    feuilles.position.y += this.size

    this.add(tronc)
    this.add(feuilles)
  }

  init () {
  }

  update (time) {
  }
}
