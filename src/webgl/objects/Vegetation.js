import {
  MeshStandardMaterial,
  RawShaderMaterial,
  Color,
  BoxBufferGeometry,
  IcosahedronBufferGeometry,
  Mesh,
  ConeBufferGeometry
} from 'three'

/** Idée
  Algo génétique pour les plantes
*/

import constants from 'utils/constants'

import Ressource from './Ressource'

import vertexShader from './ObjectShader/vegetation.vs'
import fragmentShader from './ObjectShader/vegetation.fs'

export default class Vegetation extends Ressource {
  constructor (options = {}) {
    super(options)

    this.biome = options.biome

    this.size = this.biome.humidity + this.biome.temperature + 1
    this.effectiveSize = this.size * 1.5

    this.life = options.life ? options.life : 100
    this.born = options.born ? options.born : 1
    this.init()

    let r = Math.max(0, Math.round(50 - this.biome.humidity * 50 + this.biome.temperature * 100 - this.biome.height * 100))
    let v = Math.max(0, Math.round(255 - this.biome.humidity * 50 - this.biome.temperature * 50 - this.biome.height * 100))
    let b = Math.max(0, Math.round(80 - this.biome.humidity * 40 - this.biome.temperature * 40 - this.biome.height * 100))

    this.materialFeuilles = new RawShaderMaterial({
      uniforms: {
        uDay: {
          value: 0.0
        },
        uR: {
          value: 0.0
        },
        uV: {
          value: 0.0
        },
        uB: {
          value: 0.0
        },
        uType: {
          value: 0.0
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })
    const materialTronc = new MeshStandardMaterial({ color: new Color(0xBB5533), roughness: 1 })

    let tronc
    let feuilles
    let type = 1
    if (this.biome.height > 0.6) { // Sapins
      const box = new BoxBufferGeometry(this.effectiveSize * 0.1, this.effectiveSize, this.effectiveSize * 0.1)

      const feuillesGeom = new ConeBufferGeometry(this.effectiveSize * 0.5, this.effectiveSize * 1.5, 3, 1)

      tronc = new Mesh(box, materialTronc)
      feuilles = new Mesh(feuillesGeom, this.materialFeuilles)

      tronc.position.y += this.effectiveSize * 0.5
      feuilles.position.y += this.effectiveSize
    } else if (this.biome.height > 0.5) { // Pins
      const box = new BoxBufferGeometry(this.effectiveSize * 0.1, this.effectiveSize, this.effectiveSize * 0.1)

      const feuillesGeom = new IcosahedronBufferGeometry(this.effectiveSize * 0.5)
      feuillesGeom.scale(0.7, 2, 0.7)

      tronc = new Mesh(box, materialTronc)
      feuilles = new Mesh(feuillesGeom, this.materialFeuilles)

      tronc.position.y += this.effectiveSize * 0.5
      feuilles.position.y += this.effectiveSize * 1.2
      type = 2
    } else if (this.biome.height > 0.2) { // Normaux
      const box = new BoxBufferGeometry(this.effectiveSize * 0.1, this.effectiveSize, this.effectiveSize * 0.1)

      const feuillesGeom = new IcosahedronBufferGeometry(this.effectiveSize * 0.5)

      tronc = new Mesh(box, materialTronc)
      feuilles = new Mesh(feuillesGeom, this.materialFeuilles)

      tronc.position.y += this.effectiveSize * 0.5
      feuilles.position.y += this.effectiveSize
      type = 3
    } else if (this.biome.height > 0.1) { // coraux
      const feuillesGeom = new IcosahedronBufferGeometry(this.effectiveSize * 0.3)

      r = (r + 150)
      v = Math.max(0, v - 150)
      b = Math.max(0, b - 150)
      feuilles = new Mesh(feuillesGeom, this.materialFeuilles)

      feuilles.position.y += this.effectiveSize * 0.5
      type = 4
    } else { // algues
      const feuillesGeom = new IcosahedronBufferGeometry(this.effectiveSize * 0.5)
      r = Math.max(0, r - 150)
      v = Math.max(0, v - 100)
      b = Math.max(0, b - 150)
      feuilles = new Mesh(feuillesGeom, this.materialFeuilles)
      type = 5
    }

    this.scale.set(0, 0, 0)

    if (tronc) this.add(tronc)
    this.add(feuilles)

    this.materialFeuilles.uniforms.uR.value = r / 255
    this.materialFeuilles.uniforms.uV.value = v / 255
    this.materialFeuilles.uniforms.uB.value = b / 255
    this.materialFeuilles.uniforms.uType.value = type

    this.lastChild = this.born

    this.rotateY(Math.random() * Math.PI * 2)
  }

  init () {
  }

  get canHaveChild () {
    if (this.lastChild > constants.RESSOURCES.VEGETATION.SEED_EVERY && Math.random() > 0.5) {
      return true
    }
    return false
  }

  haveChild () {
    this.lastChild = 0
  }

  update (time) {
    this.lastChild++
    this.born += constants.TIME.SPEED
    const deadTime = this.born - this.life

    this.materialFeuilles.uniforms.uDay.value = Math.sin(time)

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
