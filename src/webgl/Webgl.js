import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color
} from 'three'

import {
  OrbitControls
} from './controls/OrbitControls'

import Stats from 'stats.js'

// import Objects from './objects/Objects'
// import Ground from './objects/ground/Ground'

import createComposer from './postfx/Composer'
import createLight from './objects/Lights'

import audio from 'utils/audio'

export default class Webgl {
  constructor ($parent) {
    this.currentTime = 0
    this.render = this.render.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onBeat = this.onBeat.bind(this)

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
      1000
    )
    this.camera.position.z = 15
    this.scene.add(this.camera)
    this.scene.background = new Color(0x111)

    this.composer = createComposer(this.scene, this.camera, this.renderer)

    this.lights = createLight(this.scene)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.stats = new Stats()
    this.stats.showPanel(0)
    $parent.appendChild(this.stats.dom)

    this.initObjects()

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

  onBeat () {
    this.ground.onBeat(audio)
  }

  initObjects () {
    /* *** */
  }

  render () {
    this.stats.begin()

    this.currentTime++

    this.controls.update()

    this.scene.children.forEach((child) => {
      if (child.update) child.update(audio, this.currentTime)
    })
    // this.objects.update()
    // this.ground.update()

    // this.lights.update(this.currentTime)
    // this.renderer.render( this.scene, this.camera )
    this.composer.render()
    this.stats.end()
    requestAnimationFrame(this.render)
  }
}
