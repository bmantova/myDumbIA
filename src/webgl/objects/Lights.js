import {
  PointLight,
  AmbientLight
} from 'three'

export default function createLight (scene) {
  const light = new PointLight(0xffffff, 1, 100)
  scene.add(light)

  const ambient = new AmbientLight(0x666666)
  scene.add(ambient)

  /* const pointLightHelper = new PointLightHelper(light, 1)
  scene.add(pointLightHelper) */

  function update (time) {
    light.position.y = Math.cos(time * 0.02) * 20
    light.position.x = Math.sin(time * 0.02) * 20
  }

  return {
    light,
    ambient,
    update
  }
}
