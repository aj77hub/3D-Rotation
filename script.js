import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; 



const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//if you need a solid color on the background use below line and disable the Texture loader 
renderer.setClearColor(  0x404040 ) ;
document.body.appendChild( renderer.domElement );


const scene = new THREE.Scene();

// Create a TextureLoader
const loaderT = new THREE.TextureLoader();
//Load the image and set it as the scene background !! Make Sure the image is from HTTPS
loaderT.load('https://t4.ftcdn.net/jpg/04/33/16/71/360_F_433167186_bnAhGZ4fANlmExoSXw4EagCsfVbmAPIc.jpg', 

    function(texture) {

    scene.background = texture;
}, undefined, function(err) {
    console.error('An error occurred loading the background image:', err);
});
loaderT.load(  'https://t4.ftcdn.net/jpg/04/33/16/71/360_F_433167186_bnAhGZ4fANlmExoSXw4EagCsfVbmAPIc.jpg',
  function (texture) {
    texture.encoding = THREE.sRGBEncoding;

    // Darken pixels directly
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = texture.image;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Apply a dark filter
    ctx.fillStyle = 'rgba(0,0,0,.5)'; // 0.5 opacity black overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const darkTexture = new THREE.CanvasTexture(canvas);
    scene.background = darkTexture;
  }
);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);// Makes the camera look at the origin.


const controls = new OrbitControls( camera, renderer.domElement );



/*const geometry = new THREE.PlaneGeometry( 1,1,1);
geometry.rotateX(-Math.PI / 2);
geometry.rotateY(-Math.PI / 2);
geometry.rotateZ(-Math.PI / 2);
const material = new THREE.MeshBasicMaterial( {color: 0xd3d3d3, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
scene.add( plane );*/


//scene.background = new THREE.Color( 0xff0000 );
//scene.background = //loader.load('http://songnes.com/gift/images/andro.jpg');

/*
// Cube Model
const geometry = new THREE.BoxGeometry( 0,0,0 );
const material = new THREE.MeshPhongMaterial( { color: 0xFF7F50 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );*/


//Light is added
// Ambient Light setup
const light = new THREE.AmbientLight(0xFFFFFF, 3); // initial brightness set to 3
scene.add(light);

// Hemisphere Light setup
const light2 = new THREE.HemisphereLight(0xFFFFFF, 0x080820, 5); // initial brightness set to 5
scene.add(light2);

// Select sliders and values
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessValue = document.getElementById('brightnessValue');

const colorSlider = document.getElementById('colorSlider');
const colorValue = document.getElementById('colorValue');

// Update light brightness
brightnessSlider.addEventListener('input', (event) => {
  const newBrightness = event.target.value;
  light.intensity = newBrightness; // Update ambient light brightness
  light2.intensity = newBrightness; // Update hemisphere light brightness
  brightnessValue.textContent = newBrightness; // Update display value
});

  // Update light color intensity (using hex color value)
    colorPicker.addEventListener('input', (event) => {
      const newColor = event.target.value;
      light.color.set(newColor); // Change the color intensity of ambient light
      light2.color.set(newColor); // Change the color intensity of hemisphere light
      colorValue.textContent = newColor; // Update display value
    });





    loader.load(
        // Path to your .gltf or .glb file
        'https://cdn.tinyglb.com/models/b4bc0d70ee81429f9d6d88ad8bd43a9d.glb',      

        // Called when the resource is loaded
        function (gltf) {

          const model = gltf.scene;

           // Creates ability to move the model by arrows keys 

          document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            model.position.y += 0.1; // move up
            break;
        case "ArrowDown":
            model.position.y -= 0.1; // move down
            break;
        case "ArrowLeft":
            model.position.x -= 0.1; // move left
            break;
        case "ArrowRight":
            model.position.x += 0.1; // move right
            break;
    }
});

          //Forces Double-Sided Material
          model.traverse((child) => {
  if (child.isMesh) {
    child.material.side = THREE.DoubleSide;
  }
});


    // Rotate the model 90 degrees around the Y-axis
    model.rotation.y = Math.PI /-2;
          scene.add(model);// Add the loaded model's scene to your Three.js scene

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




//This will Render the scene so you can see the object
function animate() {

//If you want the cube to animate Activate this
  //cube.rotation.x += 0.00;
  //cube.rotation.y += 0.005;
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
