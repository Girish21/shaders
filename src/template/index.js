import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

import VertexShader from '../shader/test/vertex.vert'
import FragmentShader from '../shader/test/fragment.frag'

const canvas = document.querySelector('canvas#webGL')

const gui = new dat.GUI()

const scene = new THREE.Scene()

const geometry = new THREE.BoxBufferGeometry(1, 1, 1)

const material = new THREE.ShaderMaterial({
  vertexShader: VertexShader,
  fragmentShader: FragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(0.0, 0.0) },
  },
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

material.uniforms.uResolution.value = new THREE.Vector2(
  window.innerWidth,
  window.innerHeight
)

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
)
camera.position.set(1, 1, 1)
scene.add(camera)

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

  material.uniforms.uResolution.value = new THREE.Vector2(
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

  material.uniforms.uTime.value = elapsedTime

  mesh.rotation.set(0, elapsedTime / 5.0, 0)

  controls.update()

  renderer.render(scene, camera)

  requestAnimationFrame(tick)
}
tick()
