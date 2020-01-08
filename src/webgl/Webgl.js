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

import createComposer from './postfx/Composer'
import createLight from './objects/Lights'

import utils from 'utils/utils'
import TimeScale from 'utils/timescale'

import ADN from 'objects/ADN'
import Fellow from './objects/Fellow'
import FellowModel from './objects/FellowModel'
import constants from 'utils/constants'
import { OBJLoader } from './loader/OBJLoader.js'
import Virus from './objects/Virus.js'

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
    this.camera.position.set(500, 100, 400)
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

    window.addEventListener('resize', this.onResize, false)

    this.ts = new TimeScale()

    this.loadObj()
  }

  onResize () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.composer.effectComposer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  init (obj) {
    this.fellowGeometry = obj

    this.fellows = []
    this.fellowModel = new FellowModel({ object: this.fellowObj })
    console.log(this.fellowModel)

    this.scene.add(this.ground)

    this.raycastEvent()

    this.onResize()
    this.render()

    this.lifeSpark()
  }

  lifeSpark () {
    for (let i = 0; i < constants.FELLOW.INITIAL_NUMBER; i++) {
      const position = { x: (Math.random() - 0.5) * constants.GROUND.SIZE * 0.1, y: 0, z: (Math.random() - 0.5) * constants.GROUND.SIZE * 0.1 }
      this.addFellow(new Fellow({ ADN: new ADN({ morphology: { color: 0.5 } }), type: constants.RESSOURCES.TYPES.MEAT, object: this.fellowModel }), position)
    }
    this.ground.initialBunchOfTrees()
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

      this.currentTime += constants.TIME.SPEED

      this.controls.update()

      utils.debug('#fellows', this.fellows.length)

      if (this.fellows.length === 0) {
        this.lifeSpark()
      }

      this.ground.update(this.currentTime++)

      this.fellows.forEach((element) => {
        element.update(this)
        element.move(this)
        element.handleDeath(this)
      })

      this.composer.render()
      this.stats.end()
    }
    requestAnimationFrame(this.render)
  }

  getOthers (element) {
    return this.fellows.filter((e) => {
      return e.id !== element.id
    })
  }

  addFellow (fellow, position) {
    if (Math.random() < constants.VIRUS.INITIAL_APPEAR || fellow.virus) {
      fellow.catchVirus(new Virus())
    }
    this.fellows.push(fellow)
    this.fellows[this.fellows.length - 1].position.set(position.x, position.y, position.z)
    this.scene.add(fellow)
  }

  removeFellow (fellow) {
    this.scene.remove(fellow)
    this.fellows = this.fellows.filter((el) => el.id !== fellow.id)
  }

  searchFellow (x, y) {
    return this.fellows.filter((el) => Math.floor(el.position.x = Math.floor(x)) && Math.floor(el.position.y) === Math.floor(y))
  }

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
        if (cur) utils.mousewin('Fellow #' + i, cur.toString(), e.clientX, e.clientY)
      } else {
        utils.mousewin('close')
      }
    }.bind(this))
  }

  setMode (string) {
    this.mode = string
  }
}
