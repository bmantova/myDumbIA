import constants from 'utils/constants'
import utils from 'utils/utils'
// import Fellow from './objects/Fellow'

export default class Grid {
  constructor (options) {
    this.sub = new Array(constants.GROUND.SUB_ARRAY)
    this.scene = options.scene
    this.propagationMatrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]

    this.length = 0

    for (let i = 0; i < this.sub.length; i++) {
      this.sub[i] = new Array(constants.GROUND.SUB_ARRAY)
      for (let j = 0; j < constants.GROUND.SUB_ARRAY; j++) {
        this.sub[i][j] = []
      }
    }
  }

  getAllUnits () {
    return this.sub.flat(3)
  }

  getIndexes (position) {
    const offset = constants.GROUND.SUB_ARRAY / 2
    return {
      x: utils.limit(Math.floor((position.x / constants.GROUND.SIZE) * constants.GROUND.SUB_ARRAY + offset), 0, 32),
      y: utils.limit(Math.floor((position.z / constants.GROUND.SIZE) * constants.GROUND.SUB_ARRAY + offset), 0, 32)
    }
  }

  addUnit (unit, position) {
    const coords = this.getIndexes(position)
    this.sub[coords.x][coords.y].push(unit)
    unit.position.set(position.x, position.y, position.z)
    unit.gridPosition = coords
    this.scene.add(unit)
    this.length++
  }

  removeUnit (unit) {
    const coords = this.getIndexes(unit.position)
    console.log(unit.position)
    console.log(coords)
    console.log('test')
    const tp = this.findTruePosition(unit)
    if (coords.x !== tp.x || coords.y !== tp.y) alert('coords:' + coords.x + ', ' + coords.y + '; tp:' + tp.x + ', ' + tp.y + '; unit' + unit.gridPosition.x + ', ' + unit.gridPosition.y + '; ' + unit.type)

    this.sub[coords.x][coords.y] = this.sub[coords.x][coords.y].filter((el) => el.id !== unit.id)

    this.scene.remove(unit)
    this.length--
  }

  findTruePosition (unit) { // Parcours dans toutes les cases de la grid
    for (let i = 0; i < this.sub.length; i++) {
      for (let j = 0; j < this.sub[i].length; j++) {
        const res = this.sub[i][j].filter((el) => el.id === unit.id)
        if (res.length >= 1) return { x: i, y: j }
      }
    }
    console.log('unknow unit ', unit)
    return { x: false, y: false }
  }

  updatePosition (unit) {
    const coords = this.getIndexes(unit.position)
    if (coords.x !== unit.gridPosition.x || coords.y !== unit.gridPosition.y) {
      this.sub[unit.gridPosition.x][unit.gridPosition.y].filter(el => el.id !== unit.id)
      this.sub[coords.x][coords.y].push(unit)
      unit.gridPosition = coords
    }
  }

  getOthers (element, toEject) {
    const mapMatrix = new Array(constants.GROUND.SUB_ARRAY)
    for (let i = 0; i < mapMatrix.length; i++) {
      mapMatrix[i] = new Array(constants.GROUND.SUB_ARRAY)
      mapMatrix[i].fill(0)
    }
    mapMatrix[element.gridPosition.x][element.gridPosition.y] = 1

    const potentialTargets = []

    let n = 0
    while (potentialTargets.length === 0 && n <= constants.GROUND.SUB_ARRAY) {
      const begin = utils.limit(element.gridPosition.x - n, 0, constants.GROUND.SUB_ARRAY - 1)
      const end = utils.limit(element.gridPosition.x + n, 0, constants.GROUND.SUB_ARRAY - 1)
      for (let i = begin; i <= end; i++) {
        for (let j = begin; j <= end; j++) {
          if (mapMatrix[i][j] === 1) {
            potentialTargets.push(this.sub[i][j].filter((e) => {
              return (e.id !== element.id) && !toEject.includes(e)
            }))
            mapMatrix[i][j] = 2

            for (let k = -1; k >= 1; k++) {
              for (let l = -1; l >= 1; l++) {
                if (mapMatrix[i + k][j + l] === 0) mapMatrix[i + k][j + l] += this.propagationMatrix[k + 1][l + 1]
              }
            }
          }
        }
      }
      n++
    }
    return potentialTargets.flat(2)
  }
}
