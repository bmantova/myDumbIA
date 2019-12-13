import { TweenLite, TimelineLite, Linear } from '../libs/gsap/gsap-public/minified/gsap.min'

export default class GsapAnimations {
  constructor () {
    TweenLite.defaultEase = Linear.easeNone
    this.animation = new TimelineLite({
      onComplete: function () {
        this.restart()
      }
    })
    this.init()
  }

  init () {
    this.animation.to('#loup',
      { duration: 0.4, y: -50, ease: Linear.easeNone }, 0
    ).to('#loup',
      { duration: 0.4, y: 0, ease: Linear.easeNone }
    ).to('#lapin',
      { duration: 0.8, x: -300, ease: Linear.easeNone }, 0
    )
  }

  play () {
    this.animation.play()
  }

  pause () {
    this.animation.pause()
  }
}
