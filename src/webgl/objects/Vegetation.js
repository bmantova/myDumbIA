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
import constants from 'utils/constants'

import Ressource from './Ressource'

export default class Vegetation extends Ressource {
  constructor (options = {}) {
    super(options)

    this.life = options.life ? options.life : 100
    this.born = options.born ? options.born : 0
    this.init()
    const materialTronc = new MeshStandardMaterial({ color: new Color(0xBB5533), roughness: 1 })
    const box = new BoxBufferGeometry(this.size * 0.1, this.size, this.size * 0.1)

    const materialFeuilles = new MeshStandardMaterial({ color: new Color(0x55BB33), roughness: 1 })
    const feuillesGeom = new IcosahedronBufferGeometry(this.size * 0.5)

    const tronc = new Mesh(box, materialTronc)
    const feuilles = new Mesh(feuillesGeom, materialFeuilles)

    tronc.position.y += this.size * 0.5
    feuilles.position.y += this.size

    this.add(tronc)
    this.add(feuilles)

    this.rotateY(Math.random() * Math.PI * 2)
  }

  init () {
  }

  update (time) {
    const deltaTime = time - this.born
    const deadTime = deltaTime - this.life
    if (deltaTime < this.life) {
      const scale = Math.sin(deltaTime / (this.life * (Math.PI))) * this.size
      this.scale.set(scale, scale, scale)
    } else if (deadTime < constants.RESSOURCES.VEGETATION.FALLING_TIME) {
      this.rotateX((Math.PI / 2) / constants.RESSOURCES.VEGETATION.FALLING_TIME)
    } else {
      this.die()
    }
  }
}
