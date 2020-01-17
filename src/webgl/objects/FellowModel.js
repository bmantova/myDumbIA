import { Object3D } from 'three'

export default class FellowModel extends Object3D {
  constructor (options) {
    super()
    this.element = options.object
    this.add(options.object.clone())
    this.body = this.getObjectByName('body_Cube.001')
    this.body.position.set(0, 2.6, -0.8)
    this.neck = this.getObjectByName('neck_Cube.005')
    this.neck.position.set(0, 0.7, -0.8)
    this.neck.parent = this.body
    this.head = this.getObjectByName('head_Cube.006')
    this.head.position.set(0, 0.7, -1.6)
    this.head.parent = this.neck

    this.tail = this.getObjectByName('tail_Cube.003')
    this.tail.position.set(0, -0.5, 1.4)
    this.tail.parent = this.body

    this.leftArm = this.getObjectByName('leftArm_Cube.011')
    this.leftArm.position.set(0, 0.7, -0.6)
    this.rightArm = this.getObjectByName('rightArm_Cube.004')
    this.rightArm.position.set(0, 0.7, -0.6)
    this.leftArm.parent = this.body
    this.rightArm.parent = this.body

    this.leftWing = this.getObjectByName('leftWing_Cube.010')
    this.leftWing.position.set(0, 0.9, -0.5)
    this.rightWing = this.getObjectByName('rightWing_Cube.009')
    this.rightWing.position.set(0, 0.9, -0.5)
    this.leftWing.parent = this.body
    this.rightWing.parent = this.body

    this.leftLeg = this.getObjectByName('leftLeg_Cube.025')
    this.leftLeg.position.set(0, -0.1, 0.8)
    this.rightLeg = this.getObjectByName('rightLeg_Cube.024')
    this.rightLeg.position.set(0, -0.1, 0.8)
    this.leftLeg.parent = this.body
    this.rightLeg.parent = this.body
  }

  clone () {
    return new FellowModel({ object: this.element })
  }
}
