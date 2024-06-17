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

//LOADING SCREEN MANAGER
const loadingManager = new THREE.LoadingManager();

var display = document.querySelector('.controls-container').style.display;
const controlsContainer = document.querySelector('.controls-container');

var display = document.querySelector('.controls-mobile').style.display;
const controlsMobile = document.querySelector('.controls-mobile');

loadingManager.onStart = function(url, item, total) {
    controlsContainer.style.display = "none";
    controlsMobile.style.display = "none";
    console.log("has started to load model...");
}

const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress = function (url, loaded, total ) {
    progressBar.value = (loaded / total) * 100;
    console.log ("loading file: " + url + ".\nLoaded" + loaded + "of" + total + "files.");
}

const progressBarContainer = document.querySelector('.progress-bar-container');

loadingManager.onLoad = function() {
    controlsContainer.style.display = display;
    controlsMobile.style.display = display;
    progressBarContainer.style.display = 'none';
    setTimeout(() => {
        controlsContainer.style.display = 'none';
        controlsMobile.style.display = 'none';
    }, 6000);  
    }

//GLTF LOADER
const modelLoader = new GLTFLoader(loadingManager);
renderer.outputEncoding = THREE.sRGBEncoding

modelLoader.load(
    'Model/Homepage.glb',

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

//TV SCREENS
// ADDING VIDEO TEXTURE TO PLANE
const video = document.getElementById('TV-Texture'); //define video as a const

video.src="Videos/TV-Texture.mp4";
video.load();
video.play();
const texture = new THREE.VideoTexture(video); //call the var video as a texture
texture.needsUpdate; //refresh/update the video - like in animation
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.format = THREE.RGBAFormat;
texture.crossOrigin = 'anonymous';

var imageObject = new THREE.Mesh(
    new THREE.PlaneGeometry(9.45,5.5),
    new THREE.MeshBasicMaterial({map: texture, side: THREE.FrontSide, toneMapped: false}),);

imageObject.position.set(7.15, 6.9,  4.95)
imageObject.rotation.set(0,-0.7,0)

scene.add(imageObject);

// //FOOD COLLAGE VIDEO
const foodVideo = document.getElementById('FoodCollage'); //define video as a const

foodVideo.src="Videos/FoodCollage.mp4";
foodVideo.load();
foodVideo.play();
const foodTexture = new THREE.VideoTexture(foodVideo); //call the var video as a texture
foodTexture.needsUpdate; //refresh/update the video - like in animation
foodTexture.minFilter = THREE.LinearFilter;
foodTexture.magFilter = THREE.LinearFilter;
foodTexture.format = THREE.RGBAFormat;
foodTexture.crossOrigin = 'anonymous';

var foodObject = new THREE.Mesh(
    new THREE.PlaneGeometry(5.05, 2.84),
    new THREE.MeshBasicMaterial({map: foodTexture, side: THREE.FrontSide, toneMapped: false}),);

foodObject.position.set(15, 7.97, -8.67)
foodObject.rotation.set(0,0.07,0)

scene.add(foodObject);

//ANIMATE SCENE
function animate() {
    controls.update()

    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()

//updates and resizes the window if it is changed
window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})