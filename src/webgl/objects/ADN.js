import constants from 'utils/constants'

/* ctrlconst */ constants.RESSOURCES.REPRODUCTION = { DELTA_MAX_DIFFERENCE: 2 }

export default class ADN {
  constructor (options = { capacity: {}, reproduction: {}, morphology: {} }) {
    this.capacity = {
      sight: options.capacity.sight ? options.capacity.sight : 0.1,
      swim: options.capacity.swim ? options.capacity.swim : 0,
      breathing: options.capacity.breathing ? options.capacity.breathing : 0.1,
      fly: options.capacity.fly ? options.capacity.fly : 0,
      adaptation: options.capacity.adaptation ? options.capacity.adaptation : 0.5
    }
    this.reproduction = {
      interval: options.reproduction.interval ? options.reproduction.interval : 3,
      litter: options.reproduction.litter ? options.reproduction.litter : 1
    }
    this.diet = {
      carnivorous: options.reproduction.carnivorous ? options.reproduction.carnivorous : 0
    }
    this.morphology = {
      size: options.morphology.size ? options.morphology.size : 1,
      weight: options.morphology.weight ? options.morphology.weight : 1,
      head: options.morphology.head ? options.morphology.head : 0,
      fur: options.morphology.fur ? options.morphology.fur : 0,
      arms: options.morphology.arams ? options.morphology.arms : 0,
      wings: options.morphology.wings ? options.morphology.wings : 0,
      legs: options.morphology.legs ? options.morphology.legs : 0,
      feet: options.morphology.feet ? options.morphology.feet : 0,
      eyes: options.morphology.eyes ? options.morphology.eyes : 0,
      breathingOrifice: options.morphology.breathingOrifice ? options.morphology.breathingOrifice : 0
    }

    this.store = {
      capacity: this.capacity,
      interval: this.interval,
      morphology: this.morphology
    }
  }

  deepSumObjects (obj1, obj2) {
    return Object.keys(obj1).reduce((acc, key) => {
      if (typeof obj2[key] === 'object') {
        acc += this.deepSumObjects(obj1[key], obj2[key])
      } else if (Object.prototype.hasOwnProperty.call(obj2, key) && !isNaN(parseFloat(obj2[key]))) {
        acc += obj1[key] + obj2[key]
      }
      return acc
    }, 0)
  }

  deepAverageObjects (obj1, obj2) {
    return Object.keys(obj1).reduce((acc, key) => {
      if (typeof obj2[key] === 'object') {
        acc[key] = this.deepAverageObjects(obj1[key], obj2[key])
      } else if (Object.prototype.hasOwnProperty.call(obj2, key) && !isNaN(parseFloat(obj2[key]))) {
        acc[key] = (obj1[key] + obj2[key]) / 2
      }
      return acc
    }, {})
  }

  canFuckWith (ADN) {
    return this.deepSumObjects(this.store, ADN) < constants.RESSOURCES.REPRODUCTION.DELTA_MAX_DIFFERENCE
  }

  getMixedADNWith (ADN) {
    return this.deepAverageObjects(this.store, ADN)
  }
}
