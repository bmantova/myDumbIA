import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Raycaster,
  LoadingManager
} from 'three'

import {
  OrbitControls
} from './controls/OrbitControls'

import Stats from 'stats.js'

// import Objects from './objects/Objects'
import Ground from './objects/ground/Ground'
import Grid from './Grid'

import createComposer from './postfx/Composer'
import createLight from './objects/Lights'

import utils from 'utils/utils'
import TimeScale from 'utils/timescale'

import ADN from 'objects/ADN'
import Fellow from './objects/Fellow'
import FellowModel from './objects/FellowModel'
import constants from 'utils/constants'
import { OBJLoader } from './loader/OBJLoader.js'
import Virus from 'objects/Virus.js'
import ADNSelector from './ADNSelector.js'

/* TODO

 *** INTÉRACTIONS UTILISATEUR ***
  - Laisser le choix de l'ADN de base à l'utilisateur
  - Permettre de lancer un virus

*/

export default class Webgl {
  constructor ($parent) {
    this.mode = 'pause'
    this.currentTime = 0
    this.render = this.render.bind(this)
    this.onResize = this.onResize.bind(this)

    this.renderer = new WebGLRenderer({
      antialias: true
    })
    this.renderer.setClearColor(0x333333, 1)
    this.renderer.preserveDrawingBuffer = true

    $parent.appendChild(this.renderer.domElement)

    this.scene = new Scene()

    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )
    this.camera.position.set(-20, 15, 20)
    this.scene.add(this.camera)
    this.scene.background = new Color(0x111)

    this.composer = createComposer(this.scene, this.camera, this.renderer)

    this.lights = createLight(this.scene)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.raycaster = new Raycaster()

    this.stats = new Stats()
    this.stats.showPanel(0)
    $parent.appendChild(this.stats.dom)

    this.ground = new Ground()
    this.grid = new Grid({ scene: this.scene })
    this.updateAllFellows()

    window.addEventListener('resize', this.onResize, false)

    this.ts = new TimeScale()

    this.renderEnabled = true
    this.running = true
    this.tries = 0
    this.best = 0

    this.clicked = false
    this.isWatched = false

    this.loadObj()
    this.keyEvents()

    this.ADNSelector = new ADNSelector('ADNCursors')
  }

  onResize () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.composer.effectComposer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  init (obj) {
    this.fellowGeometry = obj

    this.fellowModel = new FellowModel({ object: this.fellowObj })

    this.scene.add(this.ground)

    this.sparkOfLife()

    this.raycastEvent()
    this.clickEvent()

    this.onResize()
    this.render()
  }

  sparkOfLife () {
    this.best = Math.max(this.best, this.ground.day)
    this.currentTime = 0
    for (let i = 0; i < constants.FELLOW.INITIAL_NUMBER; i++) {
      const position = { x: (Math.random() - 0.5) * constants.GROUND.SIZE * 0.05, y: 0, z: (Math.random() - 0.5) * constants.GROUND.SIZE * 0.05 }
      this.addFellow(new Fellow({ ADN: new ADN({ morphology: { color: 0.5 } }), type: constants.RESSOURCES.TYPES.MEAT, object: this.fellowModel }), position)
    }

    this.ground.initialBunchOfTrees()
    this.tries++
    utils.debug('#try', this.tries)
    utils.debug('best trie', this.best)
  }

  loadObj () {
    let object
    const self = this
    const loadModel = () => {
      self.fellowObj = object
      self.init()
    }
    const manager = new LoadingManager(loadModel)
    const loader = new OBJLoader(manager)

    const onError = () => {}
    const onProgress = () => {}

    loader.load('../../assets/fellow.obj', function (obj) {
      object = obj
      document.querySelector('.playButton').disabled = false
    }, onProgress, onError)

    return object
  }

  render () {
    if (this.mode === 'run') {
      this.stats.begin()

      this.controls.update()

      if (this.running) {
        this.currentTime += constants.TIME.SPEED

        utils.debug('#fellows', this.fellows.length)
        this.ground.update(this.currentTime, this.camera.position)

        let nVirus = 0

        this.fellows.forEach((element) => {
          element.update(this, this.camera.position)
          element.move(this)
          element.handleDeath(this)
          if (element.virus) nVirus++
        })

        utils.debug('#sick', nVirus)

        if (this.fellows.length === 0) {
          this.sparkOfLife()
        }
        if (this.isWatched && Math.floor(this.currentTime / constants.TIME.SPEED) % 20 === 0) {
          this.isWatched.updateInfo()
        }
      }

      if (this.renderEnabled) this.composer.render()
      this.stats.end()
    }
    requestAnimationFrame(this.render)
  }

  getOthers (element, toEject) {
    return this.grid.getOthers(element, toEject)
  }

  addFellow (fellow, position) {
    if (Math.random() <= constants.VIRUS.INITIAL_APPEAR) fellow.catchVirus(new Virus())
    this.grid.addUnit(fellow, position)
    // console.log('addFel')
    this.updateAllFellows()
  }

  removeFellow (fellow) {
    if (fellow.type === constants.RESSOURCES.TYPES.VEGETATION) alert('errrororor')
    this.grid.removeUnit(fellow)
    fellow.die()
    this.updateAllFellows()
  }

  /* searchFellow (x, y) {
    return this.fellows.filter((el) => Math.floor(el.position.x = Math.floor(x)) && Math.floor(el.position.y) === Math.floor(y))
  } */

  raycastEvent () {
    window.addEventListener('mousemove', function (e) {
      const mouse = {
        x: (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
        y: -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1
      }
      this.raycaster.setFromCamera(mouse, this.camera)

      let i = 0
      let intersected = []
      while (i < this.fellows.length && intersected.length === 0) {
        intersected = this.raycaster.intersectObject(this.fellows[i++].body.body)
      }

      if (intersected.length > 0) {
        const cur = this.fellows[i - 1]
        if (cur) {
          if (this.clicked) {
            cur.displayInfo()
            this.isWatched = cur
          }
          utils.mousewin('Fellow #' + i, cur.toString(), e.clientX, e.clientY)
        }
      } else {
        utils.mousewin('close')
      }
      this.clicked = false
    }.bind(this))
  }

  setMode (string) {
    this.mode = string
  }

  updateAllFellows () {
    this.fellows = this.grid.getAllUnits()
  }

  updatePosition (fellow) {
    this.grid.updatePosition(fellow)
  }

  keyEvents () {
    window.addEventListener('keyup', (e) => {
      // alert(e.keyCode)
      switch (e.keyCode) {
        case 72: // h
          this.renderEnabled = !this.renderEnabled
          break
        case 32: // SPACE
          this.running = !this.running
          break
      }
    })
  }

  clickEvent () {
    const self = this

    window.addEventListener('click', function () {
      self.clicked = true
    })
    document.getElementById('info').addEventListener('click', function () {
      document.getElementById('info').style.animation = '0.5s hide forwards'
      this.isWatched = false
    })
  }
}
