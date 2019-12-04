import constants from 'utils/constants'

export default class ADN {
  constructor (options = { capacity: {}, reproduction: {}, morphology: {} }) {
    if (!options.capcacity) options.capacity = {}
    if (!options.reproduction) options.reproduction = {}
    if (!options.morphology) options.morphology = {}
    if (!options.diet) options.diet = {}

    this.capacity = {
      sight: options.capacity.sight ? options.capacity.sight : 0.1,
      swim: options.capacity.swim ? options.capacity.swim : 0,
      breathing: options.capacity.breathing ? options.capacity.breathing : 0.1,
      fly: options.capacity.fly ? options.capacity.fly : 0,
      adaptation: options.capacity.adaptation ? options.capacity.adaptation : 0.5,
      longevity: options.capacity.longevity ? options.capacity.longevity : 0.5
    }
    this.reproduction = {
      interval: options.reproduction.interval ? options.reproduction.interval : 0.1,
      litter: options.reproduction.litter ? options.reproduction.litter : 0.1
    }
    this.diet = {
      carnivorous: options.reproduction.carnivorous ? options.reproduction.carnivorous : 0
    }
    this.morphology = {
      size: options.morphology.size ? options.morphology.size : 0.1,
      weight: options.morphology.weight ? options.morphology.weight : 0.1,
      head: options.morphology.head ? options.morphology.head : 0,
      neck: options.morphology.neck ? options.morphology.neck : 0,
      fur: options.morphology.fur ? options.morphology.fur : 0,
      arms: options.morphology.arms ? options.morphology.arms : 0,
      legs: options.morphology.legs ? options.morphology.legs : 0,
      feet: options.morphology.feet ? options.morphology.feet : 0,
      color: options.morphology.color ? options.morphology.color : 0.5
    }

    this.store = {
      capacity: this.capacity,
      reproduction: this.reproduction,
      diet: this.diet,
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
        acc[key] = Math.random() > 0.5 ? obj1[key] : obj2[key]
      }
      return acc
    }, {})
  }

  canFuckWith (ADN) {
    return this.deepSumObjects(this.store, ADN) < constants.RESSOURCES.REPRODUCTION.DELTA_MAX_DIFFERENCE
  }

  getADNFromReproductionWith (ADN) {
    const ADNFromReproduction = this.deepAverageObjects(this.store, ADN)
    return this.geneticEvolution(ADNFromReproduction, ADNFromReproduction.capacity.adaptation)
  }

  clamp (value, max = 1, min = 0) {
    return Math.min(Math.max(value, min), max)
  }

  geneticEvolution (ADN, adaptationCoeff) {
    return Object.keys(ADN).reduce((acc, key) => {
      if (typeof ADN[key] === 'object') {
        acc[key] = this.geneticEvolution(ADN[key], adaptationCoeff)
      } else if (Object.prototype.hasOwnProperty.call(ADN, key) && !isNaN(parseFloat(ADN[key]))) {
        const rand = Math.random()
        if (rand > adaptationCoeff) {
          acc[key] = this.clamp(ADN[key] + (rand - 0.5) * adaptationCoeff * 0.1)
        } else {
          acc[key] = ADN[key]
        }
      }
      return acc
    }, {})
  }
}
