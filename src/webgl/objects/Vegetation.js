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

/** TODO
  Size en fonction du biome
*/
import constants from 'utils/constants'

import Ressource from './Ressource'

export default class Vegetation extends Ressource {
  constructor (options = {}) {
    super(options)

    this.biome = options.biome
    this.effectiveSize = this.size * 10

    this.size = this.biome.humidity + this.biome.temperature

    this.life = options.life ? options.life : 100
    this.born = options.born ? options.born : 1
    this.init()
    const materialTronc = new MeshStandardMaterial({ color: new Color(0xBB5533), roughness: 1 })
    const box = new BoxBufferGeometry(this.effectiveSize * 0.1, this.effectiveSize, this.effectiveSize * 0.1)

    const materialFeuilles = new MeshStandardMaterial({ color: new Color(0x55BB33), roughness: 1 })
    const feuillesGeom = new IcosahedronBufferGeometry(this.effectiveSize * 0.5)

    const tronc = new Mesh(box, materialTronc)
    const feuilles = new Mesh(feuillesGeom, materialFeuilles)

    tronc.position.y += this.effectiveSize * 0.5
    feuilles.position.y += this.effectiveSize

    this.scale.set(0, 0, 0)

    this.add(tronc)
    this.add(feuilles)

    this.rotateY(Math.random() * Math.PI * 2)
  }

  init () {
  }

  update () {
    this.born += constants.TIME.SPEED
    const deadTime = this.born - this.life

    if (this.born < this.life) {
      const scale = (this.born / this.life) * this.size
      this.scale.set(scale, scale, scale)
    } else if (deadTime < constants.RESSOURCES.VEGETATION.FALLING_TIME) {
      this.rotateX((Math.PI / 2) / (constants.RESSOURCES.VEGETATION.FALLING_TIME))
    } else {
      this.die()
    }
  }
}
