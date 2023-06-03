import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 100000
parameters.size = 0.002
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.gravity = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let galaxyGeometry = null
let galaxyMaterial = null
let galaxy = null

const generateGalaxy = () => {
    if(galaxy !== null){
        galaxyGeometry.dispose()
        galaxyMaterial.dispose()
        scene.remove(galaxy)
    }

    galaxyGeometry = new THREE.BufferGeometry()

    galaxyMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    const galaxyPoints = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for(let i = 0; i < parameters.count * 3; i++){

        const i3 = i * 3

        // Position

        const radius =( Math.random()) * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const randomx = Math.pow(Math.random(), parameters.gravity) * (Math.random() < 0.5 ? 1 : -1)
        const randomy = Math.pow(Math.random(), parameters.gravity) * (Math.random() < 0.5 ? 1 : -1)
        const randomz = Math.pow(Math.random(), parameters.gravity) * (Math.random() < 0.5 ? 1 : -1)

        galaxyPoints[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomx
        galaxyPoints[i3 + 1] = randomy
        galaxyPoints[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomz

        // Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    galaxyGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(galaxyPoints, 3)
        )

    galaxyGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
        )


    galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial)
    scene.add(galaxy)
}
generateGalaxy()

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(.01).max(30).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'gravity').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Clock
// const clock = new THREE.Clock()


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update galaxy
    galaxy.rotation.y = 0.5 * elapsedTime

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
camera.position.x = 3
camera.position.y = 3
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
