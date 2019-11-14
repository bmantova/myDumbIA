import {
  Object3D
} from 'three'

import constants from 'utils/constants'

export default class Ressource extends Object3D {
  constructor (options = {}) {
    super()

    this.density = options.density ? options.density : 1
    this.size = options.size ? options.size : 1

    this.type = options.type ? options.type : constants.RESSOURCES.TYPES.VEGETATION

    if (options.position) {
      this.position.set(options.position.x, options.position.y, options.position.z)
    }

    this.init()
  }

  init () {
  }

  update (time) {
  }
}
