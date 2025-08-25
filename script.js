
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

const controls = new OrbitControls( camera, renderer.domElement );



// Cube Model
//const geometry = new THREE.BoxGeometry(.5,.5,.5 );
//const material = new THREE.MeshPhongMaterial( { color: 0xFF7F50 } );
//const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

//Light is added
const light = new THREE.AmbientLight( 0x404040, 50); // soft white light
scene.add( light );

camera.position.z = 5;

    loader.load(
        // Path to your .gltf or .glb file
        'https://cdn.tinyglb.com/models/c059175b3c22405e90d5d5a284fa2de5.glb',
        // Called when the resource is loaded
        function (gltf) {
            scene.add(gltf.scene); // Add the loaded model's scene to your Three.js scene
            console.log('Model loaded successfully!');
            // You can also access animations, cameras, etc. from gltf.animations, gltf.cameras
        },
        // Called while loading is progressing
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Called when loading has errors
        function (error) {
            console.error('An error occurred while loading the model:', error);
        }
    );

function animate() {
  
//If you want the cube to animate Activate this
  cube.rotation.x += 0.00;
  cube.rotation.y += 0.005;
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
