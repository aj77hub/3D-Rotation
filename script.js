import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; 

// === DOM elements ===
const loaderOverlay = document.getElementById("loader");
const thumbnails = document.querySelectorAll("#thumbnails img");
const toggleButton = document.getElementById("toggleAnimation");
const slider = document.getElementById("animationSlider");

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

// === OrbitControls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.8;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.minDistance = 0.5;
controls.maxDistance = 50;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.minAzimuthAngle = -Infinity;
controls.maxAzimuthAngle = Infinity;

// === Lighting ===
const light = new THREE.AmbientLight(0xFFFFFF, 3);
scene.add(light);

// === Animation mixer ===
let mixer;
let currentModel;
let currentAction;
let isPlaying = true;
const clock = new THREE.Clock();

// === Play/Pause Button ===
toggleButton.addEventListener("click", () => {
  if (!mixer || !currentAction) return;

  currentAction.paused = isPlaying;
  toggleButton.textContent = isPlaying ? "▶️" : "⏸️";
  isPlaying = !isPlaying;
});

// === Slider Control ===
slider.addEventListener("input", () => {
  if (!currentAction) return;
  const duration = currentAction.getClip().duration;
  currentAction.time = slider.value * duration;
  mixer.update(0); // Force update
});

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

// === Load model ===
function loadModel(url) {
  loaderOverlay.style.display = "flex";

  loader.load(
    url,
    function (gltf) {
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
      fitCameraToObject(camera, currentModel);

      mixer = new THREE.AnimationMixer(currentModel);
      const clip = gltf.animations[0];
      currentAction = mixer.clipAction(clip);
      currentAction.play();
      currentAction.paused = true; // Start paused
      isPlaying = false;
      toggleButton.textContent = "▶️"; // Update button to show play icon


      loaderOverlay.style.display = "none";
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
loadModel("https://3d-assests.netlify.app/asset/JoeyblendBox.glb");

// === Thumbnail click events ===
thumbnails.forEach(img => {
  img.addEventListener("click", () => {
    const modelUrl = img.getAttribute("data-model");
    loadModel(modelUrl);
  });
});

const swipeOverlay = document.getElementById("swipeOverlay");
swipeOverlay.addEventListener("click", () => {
  swipeOverlay.style.display = "none";
});

// === Animation loop ===
renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();
  if (mixer && currentAction && isPlaying) {
    mixer.update(delta);
    const duration = currentAction.getClip().duration;
    slider.value = currentAction.time / duration;
  }
  controls.update();
  renderer.render(scene, camera);
});
