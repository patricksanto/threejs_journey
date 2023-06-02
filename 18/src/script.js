import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const particlesTexture = textureLoader.load('/textures/particles/11.png')

/**
 * Particles
 */

const particlesGeometry = new THREE.BufferGeometry()
const count =  20000

const position = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++){
    position[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

//Material
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.12
particlesMaterial.sizeAttenuation = true
// particlesMaterial.color = new THREE.Color('#ff88cc')
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particlesTexture
// particlesMaterial.alphaTest = 0.001
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    for(let i = 0; i < count; i++){
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3]
        // particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x )
        // particlesGeometry.attributes.position.array[i3] = Math.cos(elapsedTime) / 4
        particlesGeometry.attributes.position.array[i3 + 2] = Math.sin(elapsedTime + x / 4 )
    }
    particlesGeometry.attributes.position.needsUpdate = true

    // animate camera
    // camera.position.x = Math.sin(elapsedTime * .1) * Math.sin(elapsedTime * .2)
    // camera.position.z = Math.cos(elapsedTime * .1)
    // camera.position.y = Math.sin(elapsedTime * .1) * Math.cos(elapsedTime * .2)
    // camera.lookAt(particles.position)

    //update particles
    // particles.position.y = - elapsedTime * .2
    // particles.position.x = Math.sin(elapsedTime * .5)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
