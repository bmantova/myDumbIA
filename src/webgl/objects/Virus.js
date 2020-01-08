// import constants from 'utils/constants'

export default class Virus {
  constructor (options = {}) {
    this.mortality = options.mortality | 20
    this.transmission = options.transmission | 1
    this.distance = options.distance | 1
  }
}
