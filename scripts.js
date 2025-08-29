import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; 

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x404040); // Optional solid background
document.body.appendChild(renderer.domElement);

// Scene setup
const scene = new THREE.Scene();

// Background texture
const loaderT = new THREE.TextureLoader();
loaderT.load('./DarkSky.jpg', (texture) => {
  texture.encoding = THREE.sRGBEncoding;
  scene.background = texture;
}, undefined, (err) => {
  console.error('Error loading background image:', err);
});

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting
const light = new THREE.AmbientLight(0xffffff, 3);
scene.add(light);

// Optional: Color picker logic (ensure these elements exist in your HTML)
const colorPicker = document.getElementById('colorPicker');
const colorValue = document.getElementById('colorValue');

if (colorPicker && colorValue) {
  colorPicker.addEventListener('input', (event) => {
    const newColor = event.target.value;
    light.color.set(newColor);
    colorValue.textContent = newColor;
  });
}

// Load GLTF model
const loader = new GLTFLoader();
loader.load(
  './MushroomHouse.glb',
  (gltf) => {
    const model = gltf.scene;

    // Double-sided materials
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.side = THREE.DoubleSide;
      }
    });

    // Rotate model
    model.rotation.y = -Math.PI / 2;

    scene.add(model);
    console.log('Model loaded successfully!');
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (error) => {
    console.error('Error loading model:', error);
  }
);

// Animation loop
function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
