/* factory */
// import { datGui } from 'utils/debug'
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { Clock } from 'three'

export default function createComposer (scene, camera, renderer) {
  const clock = new Clock()

  const bloomEffect = new BloomEffect({ resolutionScale: 0.5 })
  bloomEffect.luminanceMaterial.threshold = 0
  const effectComposer = new EffectComposer(renderer)

  const effectPass = new EffectPass(camera, bloomEffect)
  effectPass.renderToScreen = true

  // const pixelationEffect = new PixelationEffect(params.granularity)

  effectComposer.addPass(new RenderPass(scene, camera))
  effectComposer.addPass(effectPass)

  // addGui()

  /* function addGui () {
    const folder = datGui.addFolder('Composer')
    folder.add(params, 'scale').min(0).max(1).onChange((value) => {
      bloomEffect.scale = value
    })
    folder.add(params, 'threshold').min(0).max(1).onChange((value) => {
      bloomEffect.luminanceMaterial.threshold = value
    })
    // if (pixelationEffect.renderToScreen) {
    //   datGui.add(params, 'granularity').min(0).max(50).step(1).onChange((value) => {
    //     console.log(value)
    //     pixelationEffect.setGranularity(value)
    //   })
    // }
  } */

  function render () {
    effectComposer.render(clock.getDelta())
  }

  return {
    effectComposer,
    render
  }
}
