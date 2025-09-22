import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; 

// === DOM elements for loader overlay and thumbnails ===
const loaderOverlay = document.getElementById("loader");
const thumbnails = document.querySelectorAll("#thumbnails img");

// === Three.js setup ===
const loader = new GLTFLoader();
const container = document.getElementById("scene-container");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// === Camera ===
const camera = new THREE.PerspectiveCamera(
  30,
  container.clientWidth / container.clientHeight,
  1,
  500
);
camera.position.set(10,10,10);
camera.lookAt(0, 0, 0);

// === OrbitControls with full rotation unlocked ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.8;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.minDistance = 0.5;  // can zoom in very close
controls.maxDistance = 50;   // can zoom far out

// FULL rotation freedom
controls.minPolarAngle = 0;          // straight up
controls.maxPolarAngle = Math.PI;    // straight down
controls.minAzimuthAngle = -Infinity;
controls.maxAzimuthAngle = Infinity;

// === Lighting ===
const light = new THREE.AmbientLight(0xFFFFFF, 3);
scene.add(light);

// === Animation mixer ===
let mixer;
let currentModel;
const clock = new THREE.Clock();

// === Fit camera to object ===
function fitCameraToObject(camera, object, offset = 1) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;

  camera.position.set(center.x, center.y , center.z + 20);
  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();
}

// === Function to load models ===
function loadModel(url) {
  loaderOverlay.style.display = "flex"; // Show loader

  loader.load(
    url,
    function (gltf) {
      // Remove old model if exists
      if (currentModel) {
        scene.remove(currentModel);
        currentModel.traverse(child => {
          if (child.isMesh) {
            child.geometry.dispose();
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        });
      }

      currentModel = gltf.scene;
      scene.add(currentModel);

      // Auto-fit camera to new model
      fitCameraToObject(camera, currentModel);

      mixer = new THREE.AnimationMixer(currentModel);
      gltf.animations.forEach(clip => mixer.clipAction(clip).play());

      loaderOverlay.style.display = "none"; // Hide loader
    },
    function (xhr) {
      const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
      loaderOverlay.querySelector("p").textContent = `Loading ${percent}%`;
    },
    function (error) {
      console.error("Error loading model:", error);
      loaderOverlay.style.display = "none";
    }
  );
}

// === Initial model load ===
loadModel("https://skfb.ly/pBuEF");

// === Thumbnail click events ===
thumbnails.forEach(img => {
  img.addEventListener("click", () => {
    const modelUrl = img.getAttribute("data-model");
    loadModel(modelUrl);
  });
});


// === Hide the hand ===
const swipeOverlay = document.getElementById("swipeOverlay");

swipeOverlay.addEventListener("click", () => {
  swipeOverlay.style.display = "none";
});


// === Animation loop ===
renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  controls.update();
  renderer.render(scene, camera);
});
