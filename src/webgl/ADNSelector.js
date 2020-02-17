import ADN from './objects/ADN'
import Cursor from 'utils/cursor'
import Fellow from './objects/Fellow'
import {
  OrbitControls
} from './controls/OrbitControls'

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color
  // SphereBufferGeometry,
  // MeshBasicMaterial,
  // Mesh
} from 'three'

export default class ADNSelector {
  constructor ($parent, model) {
    this.parent = document.querySelector('#' + $parent)
    this.chosenADN = new ADN()
    this.model = model
    this.setWebgl()
    this.display = false
    this.currentTime = 0
  }

  init () {
    this.iterateOverADN(this.chosenADN.store)
  }

  setWebgl () {
    this.renderer = new WebGLRenderer({
      antialias: true
    })
    this.width = 400
    this.height = 600
    this.renderer.setClearColor(0x0000, 1)
    this.renderer.preserveDrawingBuffer = true
    this.parent.parentNode.appendChild(this.renderer.domElement)
    this.renderer.domElement.id = 'previzCanvas'
    this.renderer.setSize(this.width, this.height)
    this.scene = new Scene()
    this.scene.background = new Color(0x000000)

    this.camera = new PerspectiveCamera(
      50,
      this.width / this.height,
      0.1,
      500
    )
    this.camera.position.set(5, 5, 5)
    this.scene.add(this.camera)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.setFellow()

    this.scene.add(this.fellow)
    // this.scene.add(new Mesh(new SphereBufferGeometry(5, 5, 5), new MeshBasicMaterial({ color: 0xff0000 })))
  }

  iterateOverADN (obj) {
    return Object.keys(obj).reduce((acc, key) => {
      if (typeof obj[key] === 'object') {
        this.addTitle(key)
        this.iterateOverADN(obj[key])
      } else if (Object.prototype.hasOwnProperty.call(obj, key) && !isNaN(parseFloat(obj[key]))) {
        this.addCursor(key, obj[key])
      }
      return acc
    }, [])
  }

  addCursor (name, value) {
    const cursor = new Cursor(name, value * 100)
    const self = this
    cursor.setUpdate((value) => { self.updateChosenADN(name, value / 100) })
    this.currentCategory.appendChild(cursor.DOM)
    cursor.init()
  }

  updateChosenADN (name, value) {
    this.chosenADN.setParameters(name, value)
    this.scene.remove(this.fellow)
    this.setFellow()
    this.scene.add(this.fellow)
  }

  setFellow () {
    this.fellow = new Fellow({ ADN: this.chosenADN, object: this.model })
    this.fellow.age = 0.5
    this.fellow.position.set(0, 0, 0)
  }

  update () {
    if (this.display) {
      this.currentTime++
      this.fellow.rotation.y = this.currentTime * 0.01
      this.fellow.animate(this)
      this.renderer.render(this.scene, this.camera)
    }
  }

  run () {
    this.display = true
  }

  stop () {
    this.display = false
  }

  addTitle (name) {
    const title = document.createElement('div')
    title.id = name
    title.classList.add('selectorCategory')
    title.innerHTML = '<h3>' + name + '</h3>'
    this.parent.appendChild(title)
    this.currentCategory = title
  }
}
