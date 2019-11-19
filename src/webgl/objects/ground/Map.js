
export default class Map {
  constructor (options) {
    this.max = options.max ? options.max : 0.1
    this.n = options.n ? options.n : 20
    this.exp = options.exp ? options.exp : 6

    this.xHtab = []
    this.yHtab = []
    this.ampltab = []

    this.init()
  }

  init () {
    for (let i = 0; i < this.n * this.exp; i++) {
      this.xHtab.push(this.randfloat(0.0001, this.max))
      this.yHtab.push(this.randfloat(0.0001, this.max))
      this.ampltab.push(this.randfloat(0.01, 1))

      // + decalage sinusoïdes
    }
  }

  get (x, y) {
    // return Math.sin(x * 0.1) + Math.sin(x * 0.05) + Math.sin(y * 0.1) + Math.sin(y * 0.2)

    let h = 1
    y = y * 0.01
    for (let e = 1; e < this.exp; e++) {
      for (let i = 0; i < this.n; i++) {
        // h += (Math.cos(x * this.xHtab[e * this.n + i] * e + y * this.yHtab[e * this.n + i] * e)) * this.ampltab[e * this.n + i]
        // h += (Math.sin(x * this.xHtab[e * this.n + i] * e) * Math.sin(y * this.yHtab[e * this.n + i] * 100 * e)) * this.ampltab[e * this.n + i]
        h += (Math.sin(x * this.xHtab[e * this.n + i] * e) * Math.sin(y * this.yHtab[e * this.n + i] * 100 * e)) * this.ampltab[e * this.n + i]
      }
    }
    return h / (this.max * this.n * this.exp)
  }

  randfloat (a, b) {
    return Math.random() * (b - a) + a
  }
}
