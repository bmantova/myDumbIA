import { Object3D/* , RawShaderMaterial */ } from 'three'

// import { datGui } from 'utils/debug'
// import Bobby from './Bobby'

// import vertexShader from './ObjectShader/object.vs'
// import fragmentShader from './ObjectShader/object.fs'

export default class Objects extends Object3D {
  constructor () {
    super()

    /* this.colors = {
      primary: '#63bff0',
      emissive: '#FFFF00'
    } */

    this.initMaterial()

    this.addControlGui()
  }

  initMaterial () {
    /* this.myMat = new MeshPhysicalMaterial({
      color: new Color(this.colors.primary),
      metalness: 0.5,
      roughness: 0.1,
      emissive: new Color(this.colors.emissive)
    }) */
    /* this.myMat = new RawShaderMaterial({
      uniforms: {
        uTime: { value: 1.0 },
        uPosX: { value: 0.0 },
        uPosY: { value: 0.0 },
        uPosZ: { value: 0.0 },
        uAmplitude: { value: 5.0 },
        uWave: { value: 10.0 },
        uVelocity: { value: 1.0 }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })
  } */

  /* addMaterialGui () {
    const matFolder = datGui.addFolder('Objects Material')
    matFolder.add(this.myMat, 'metalness').min(0).max(1).step(0.1)
    matFolder.add(this.myMat, 'roughness').min(0).max(1).step(0.1)
    matFolder.addColor(this.colors, 'primary').onChange((value) => {
      this.myMat.color = new Color(value)
    })
    matFolder.addColor(this.colors, 'emissive').onChange((value) => {
      this.myMat.emissive = new Color(value)
    }) */
  }

  addControlGui () {
    /* const matFolder = datGui.addFolder('Objects Control Speed')
    matFolder.add(this.rotationSpeed, 'x').min(0).max(10)
    matFolder.add(this.rotationSpeed, 'y').min(0).max(10)
    matFolder.add(this.rotationSpeed, 'z').min(0).max(10)

    matFolder.add(this.positionSpeed, 'x').min(0).max(10)
    matFolder.add(this.positionSpeed, 'y').min(0).max(10)
    matFolder.add(this.positionSpeed, 'z').min(0).max(10)

    matFolder.add(this.positionSpeed, 'amplX').min(0).max(10)
    matFolder.add(this.positionSpeed, 'amplY').min(0).max(10)
    matFolder.add(this.positionSpeed, 'amplZ').min(0).max(10)

    const audioFolder = datGui.addFolder('Audio Reaction')
    audioFolder.add(this.audioRect, 'volumeHistory').min(0).max(2)
    audioFolder.add(this.audioRect, 'waveData').min(0).max(10) */
  }

  update (audio, t) {
    /* const histLength = audio.volumeHistory.length
    const waveLength = audio.waveData.length
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      child.rotation.set((child.position.x + t) * 0.1 * this.rotationSpeed.x,
        (child.position.y + t) * 0.1 * this.rotationSpeed.y + audio.waveData[Math.round(i / (this.children.length / waveLength))] * this.audioRect.waveData,
        (child.position.x + t) * 0.1 * this.rotationSpeed.z)

      child.position.set(child.initialPosition.x + Math.sin(this.positionSpeed.x * (t + child.initialPosition.y) * 0.1) * this.positionSpeed.amplX,
        child.initialPosition.y + Math.sin(this.positionSpeed.y * (t + child.initialPosition.x) * 0.1) * this.positionSpeed.amplY,
        child.initialPosition.z + Math.sin(this.positionSpeed.z * (t + child.initialPosition.x) * 0.1) * this.positionSpeed.amplZ + audio.volumeHistory[histLength - Math.round(i / (this.children.length / histLength))] * this.audioRect.volumeHistory)

      child.material.uniforms.uTime.value = t
      child.material.uniforms.uPosX.value = child.position.x
      child.material.uniforms.uPosY.value = child.position.y
      child.material.uniforms.uPosZ.value = child.position.z
    } */
  }
}
