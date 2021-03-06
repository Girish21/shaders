import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

import PerlinVertexShader from '../../shader/sun/baseTexture/vertex.vert'
import PerlinFragmentShader from '../../shader/sun/baseTexture/fragment.frag'

import BaseVertexShader from '../../shader/sun/cubeTexture/vertex.vert'
import BaseFragmentShader from '../../shader/sun/cubeTexture/fragment.frag'

import AroundVertexShader from '../../shader/sun/aroundTexture/vertex.vert'
import AroundFragmentShader from '../../shader/sun/aroundTexture/fragment.frag'

const canvas = document.querySelector('canvas#webGL')

const init = () => {
  const gui = new dat.GUI()

  const scene = new THREE.Scene()
  const perlinScene = new THREE.Scene()

  const geometry = new THREE.SphereBufferGeometry(1, 30, 30)

  // Base texture
  const materialSun = new THREE.ShaderMaterial({
    vertexShader: BaseVertexShader,
    fragmentShader: BaseFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(0.0, 0.0) },
      uPerlin: { value: null },
    },
  })

  const mesh = new THREE.Mesh(geometry, materialSun)
  scene.add(mesh)

  // sun around texture
  const aroundMaterialSun = new THREE.ShaderMaterial({
    vertexShader: AroundVertexShader,
    fragmentShader: AroundFragmentShader,
    side: THREE.BackSide,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(0.0, 0.0) },
      uPerlin: { value: null },
    },
    transparent: true,
  })
  const aroundSunGeometry = new THREE.SphereBufferGeometry(1.2, 30, 30)
  const aroundSunMesh = new THREE.Mesh(aroundSunGeometry, aroundMaterialSun)
  scene.add(aroundSunMesh)

  // canvas size
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // pass resolution to base material shader
  materialSun.uniforms.uResolution.value = new THREE.Vector2(
    window.innerWidth,
    window.innerHeight
  )

  // Three perspective camera
  const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    100
  )
  camera.position.set(0, 0, 2)
  scene.add(camera)

  // Cube renderer
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    encoding: THREE.sRGBEncoding,
  })

  // cube camera
  const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget)

  // cube material
  const perlinMaterialSun = new THREE.ShaderMaterial({
    vertexShader: PerlinVertexShader,
    fragmentShader: PerlinFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(0.0, 0.0) },
    },
  })

  const perlinMesh = new THREE.Mesh(geometry, perlinMaterialSun)
  perlinScene.add(perlinMesh)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.render(scene, camera)

  const clock = new THREE.Clock()

  window.addEventListener('resize', () => {
    size.width = window.innerWidth
    size.height = window.innerHeight

    materialSun.uniforms.uResolution.value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    )

    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    materialSun.uniforms.uTime.value = elapsedTime
    perlinMaterialSun.uniforms.uTime.value = elapsedTime

    cubeCamera.update(renderer, perlinScene)
    materialSun.uniforms.uPerlin.value = cubeRenderTarget.texture

    controls.update()

    renderer.render(scene, camera)

    requestAnimationFrame(tick)
  }
  tick()
}

export default init
