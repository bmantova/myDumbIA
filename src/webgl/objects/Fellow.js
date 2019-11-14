import Ressource from './Ressource'
import ADN from './ADN'

export default class Fellow extends Ressource {
  constructor (options) {
    super(options)
    this.ADN = new ADN(options.ADN)
  }
}
