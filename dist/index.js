import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

var controls
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()


//RENDERER SETUP
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(0.6)
renderer.shadowMap.enabled = true


//CAMERA AND CONTROLS
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100000)
camera.position.set(-10, 25, 50)
scene.add(camera)

controls = new OrbitControls(camera, renderer.domElement)
controls.maxDistance = 75
controls.maxPolarAngle = 1.75


//BOX FOR TESTING
// const geometry = new THREE.BoxGeometry(1,1,1)
// const material = new THREE.MeshBasicMaterial({
//     color:0x00ff00
// })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)


//GLTF LOADER
const modelLoader = new GLTFLoader()
renderer.outputEncoding = THREE.sRGBEncoding

modelLoader.load(
    'Homepage.glb',

    function(gltf) {
        scene.add( gltf.scene)
        gltf.scene.position.set(-7.5, 0, 0)
        gltf.scene.scale.set(12, 12, 12)
        gltf.scene.rotation.set(0, -0.70, 0)
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    function(error) {
        console.log('An error happened', error)
    }
)


//SKYBOX
const skyMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1000, 32, 32),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.BackSide,
    })
    )

scene.add(skyMesh);


//FOG
scene.fog = new THREE.FogExp2(0x9E9759, 0.005);


//LIGHTING
const pointLight = new THREE.PointLight(0xffffff, 25)
pointLight.position.set(20, 10, -10)
pointLight.castShadow = true;

const pointLight2 = new THREE.PointLight(0xffffff, 25)
pointLight2.position.set(1, 10, 10) 
pointLight2.castShadow = true;

const pointLight3 = new THREE.PointLight(0xffffff, 25)
pointLight3.position.set(-17, 10, -12)
pointLight3.castShadow = true;

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
directionalLight.castShadow = true;
directionalLight.position.set(2.36, 4.57, 8.98)

scene.add(directionalLight, pointLight, pointLight2, pointLight3)


//ANIMATE SCENE
function animate() {
    controls.update()

    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()