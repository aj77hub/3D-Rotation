import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
const controls = new OrbitControls(camera, renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0x404040, 3);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

camera.position.set(0, 2, 5);

// Load model
loader.load('./Joeyblend.glb', function (gltf) {
    scene.add(gltf.scene);

    // Auto center & fit camera
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    camera.position.copy(center);
    camera.position.z += size.length() * 1.5;
    camera.lookAt(center);

    console.log('Model loaded successfully!');
}, undefined, function (error) {
    console.error('An error occurred while loading the model:', error);
});

function animate() {
    controls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
