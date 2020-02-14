
import './styles.css'
import Webgl from './webgl/Webgl'
import MapSimulator from './webgl/objects/mapSimulator/mapSimulator'
import HomeScreen from './webgl/objects/HomeScreen'
import SnapAnimations from './animations/SnapAnimations'
import GsapAnimations from './animations/GsapAnimations'
import ADNSelector from './webgl/ADNSelector'

/* eslint-disable-next-line */
const webgl = new Webgl(document.querySelector('#Play'))
webgl.setMode('pause')

/* eslint-disable-next-line */
const homescreen = new HomeScreen(document.querySelector('#HomeScreen'))

/* SNAP ANIMATIONS */
const snapAnimations = new SnapAnimations()

/* GSAP ANIMATIONS */
const gsapAnimations = new GsapAnimations()

/* LISTENERS */
const playButton = document.querySelector('.playButton')
playButton.addEventListener('click', () => {
  document.querySelector('#Play').classList.add('appearAnimation')
  webgl.setMode('run')
})

const aboutButton = document.querySelector('.aboutButton')
aboutButton.addEventListener('click', () => {
  document.querySelector('#About').classList.remove('disappearAnimation')
  document.querySelector('#About').classList.add('appearAnimation')
  snapAnimations.launch()
  gsapAnimations.play()
})
const returnButton = document.querySelector('.returnButton')
returnButton.addEventListener('click', () => {
  document.querySelector('#About').classList.remove('appearAnimation')
  document.querySelector('#About').classList.add('disappearAnimation')
  snapAnimations.pause()
  gsapAnimations.pause()
})

const openADNCursorsButton = document.querySelector('#openADNCursorsButton')
openADNCursorsButton.addEventListener('click', () => {
  document.querySelector('#ADNCursors').style.marginTop = '0%'
})

const closeADNCursorsButton = document.querySelector('#closeADNCursorsButton')
closeADNCursorsButton.addEventListener('click', () => {
  document.querySelector('#ADNCursors').style.marginTop = '-100%'
})

/* eslint-disable-next-line */
const mapSimulator = new MapSimulator(document.querySelector('#mapAbout'))
const adnSelector = new ADNSelector('ADNCursors')
adnSelector.init()
