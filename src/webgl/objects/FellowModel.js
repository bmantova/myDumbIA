export default class FellowModel {
  constructor (options) {
    this.parts = options.object.children
    this.body = options.object.clone()
  }
}
