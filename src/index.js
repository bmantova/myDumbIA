import './styles.css'
import Webgl from './webgl/Webgl'

const webgl = new Webgl(document.querySelector('#Play'))
console.log(webgl)

const aboutButton = document.querySelector('.aboutButton')
aboutButton.addEventListener('click', () => { document.querySelector('#About').classList.add('appearAnimation') })
const playButton = document.querySelector('.playButton')
playButton.addEventListener('click', () => { document.querySelector('#Play').classList.add('appearAnimation') })
