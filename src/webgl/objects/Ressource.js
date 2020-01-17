import {
  Object3D
} from 'three'

import constants from 'utils/constants'

export default class Ressource extends Object3D {
  constructor (options = {}) {
    super()

    this.density = options.density ? options.density : 1
    this.size = options.size ? options.size : 1
    this.alive = true
    this.gridPosition = { x: 0, y: 0 }

    this.type = options.type ? options.type : constants.RESSOURCES.TYPES.VEGETATION

    if (options.position) {
      this.position.set(options.position.x, options.position.y, options.position.z)
    }

    this.init()
  }

  isAlive () {
    return this.alive
  }

  die () {
    this.alive = false
  }

  getSpeed () {
    return 0
  }

  init () {
  }

  update (time) {
  }
}
