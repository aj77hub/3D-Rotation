import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; 



const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//if you need a solid color on the background use below line and disable the Texture loader 
renderer.setClearColor(  0x404040 ) ;
document.body.appendChild( renderer.domElement );

  const loader = new GLTFLoader();
loader.load( './MushroomHouse.glb', function ( gltf ) {
  scene.add( gltf.scene );
}, undefined, function ( error ) {
  console.error( error );
} );


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);// Makes the camera look at the origin.


const controls = new OrbitControls( camera, renderer.domElement );





// Cube Model
const geometry = new THREE.BoxGeometry( 0,0,0 );
const material = new THREE.MeshPhongMaterial( { color: 0xFF7F50 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


//Light is added
// Ambient Light setup
const light = new THREE.AmbientLight(0xFFFFFF, 3); // initial brightness set to 3
scene.add(light);




   


//This will Render the scene so you can see the object
function animate() {
  
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
