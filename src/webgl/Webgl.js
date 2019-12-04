import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Raycaster
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

import ADN from 'objects/ADN'
import Fellow from './objects/Fellow'
import constants from 'utils/constants'

export default class Webgl {
  constructor ($parent) {
    this.currentTime = 0
    this.previousTime = 0
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
    this.camera.position.set(0, 150, 400)
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

    /* DEBUT DEBUG AXEL */
    const adns = []
    const first = new ADN()
    const second = new ADN()
    adns.push(first)
    adns.push(second)

    this.fellows = []
    for (let i = 0; i < 20; i++) {
      const position = { x: (Math.random() - 0.5) * constants.GROUND.SIZE, y: 0, z: (Math.random() - 0.5) * constants.GROUND.SIZE }
      this.addFellow(new Fellow({ ADN: new ADN({ morphology: { color: 0.0 } }), type: constants.RESSOURCES.TYPES.MEAT }), position)
    }

    /* FIN DEBUG AXEL */

    this.scene.add(this.ground)

    this.initObjects()
    this.raycastEvent()

    this.onResize()
    this.render()

    // if you don't want to hear the music, but keep analysing it, set 'shutup' to 'true'!
    // audio.start({ live: false, shutup: false, showPreview: false, debug: true })
    // audio.onBeat.add(this.onBeat)

    window.addEventListener('resize', this.onResize, false)
  }

  onResize () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.composer.effectComposer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  initObjects () {
    /* *** */
  }

  render () {
    this.stats.begin()

    this.currentTime++

    this.controls.update()

    utils.debug('#fellows', this.fellows.length)

    this.ground.update(this.currentTime++)

    this.fellows.forEach((element) => {
      element.update(this)
      element.move(this)
      element.handleDeath(this)
    })

    // this.objects.update()
    // this.ground.update()

    // this.lights.update(this.currentTime)
    // this.renderer.render( this.scene, this.camera )
    this.composer.render()
    this.stats.end()
    if (this.currentTime > this.previousTime + 80) {
      this.previousTime = this.currentTime
    }
    // requestAnimationFrame(this.render)
  }

  getOthers (element) {
    return this.fellows.filter((e) => {
      return e.id !== element.id
    })
  }

  addFellow (fellow, position) {
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
        intersected = this.raycaster.intersectObject(this.fellows[i++].body)
      }

      if (intersected.length > 0) {
        const cur = this.fellows[i--]
        utils.mousewin('Fellow #' + i, cur.toString(), e.clientX, e.clientY)
      } else {
        utils.mousewin('close')
      }
    }.bind(this))
  }
}
