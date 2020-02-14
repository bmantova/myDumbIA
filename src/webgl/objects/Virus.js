import constants from 'utils/constants'
import utils from 'utils/utils'

export default class Virus {
  constructor (options = {}) {
    this.mortality = options.mortality ? options.mortality : 5
    this.transmission = options.transmission ? options.transmission : 0.05
    this.distance = options.distance ? options.distance : 3
    this.steril = options.steril ? options.steril : 0.5
    this.pass = 0
  }

  evolve () {
    this.mortality = utils.limit(this.mortality + (Math.random() - 0.5) * 50 * 0.01, 0, 50)
    this.transmission = utils.limit(this.transmission + (Math.random() - 0.5) * 0.01, 0, 1)
    this.distance = utils.limit(this.distance + (Math.random() - 0.5) * 50 * 0.01, 0, 50)
    this.steril = utils.limit(this.steril + (Math.random() - 0.5) * 0.01, 0, 1)
    this.pass++
    constants.VIRUS.BEST_VIRUS = Math.max(constants.VIRUS.BEST_VIRUS, this.pass)
    utils.debug('best virus', constants.VIRUS.BEST_VIRUS)
  }

  toString () {
    let str = '<p>mortality<b>' + utils.virg(this.mortality, 3) + '</b></p>'
    str += '<p>transmission<b>' + utils.virg(this.transmission, 3) + '</b></p>'
    str += '<p>distance<b>' + utils.virg(this.distance, 3) + '</b></p>'
    str += '<p>steril<b>' + utils.virg(this.steril, 3) + '</b></p>'
    str += '<p>#pass<b>' + utils.virg(this.pass, 3) + '</b></p>'

    return str
  }
}
