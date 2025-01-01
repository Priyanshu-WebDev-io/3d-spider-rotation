import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
let model = document.getElementById("model");

const pointLight = new THREE.PointLight("white", 10, 1000);
pointLight.position.set(0, 0, 2);
scene.add(pointLight);

// const pointLight_1 = new THREE.PointLight("white", 10, 1000);
// pointLight_1.position.set(0, 0, -2);
// scene.add(pointLight_1);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);
// const pointLightHelper_1 = new THREE.PointLightHelper(pointLight_1, 1);
// scene.add(pointLightHelper_1);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  5000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("model").appendChild(renderer.domElement);

// scene.background = new THREE.TextureLoader().load("/pexels.");

const loader = new GLTFLoader();

loader.load(
  "/Spider_hd.glb",
  function (gltf) {
    scene.add(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error occurred: " + error);
  }
);

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 100;
controls.enableZoom = false;
controls.enableRotate = false;
controls.update();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

scene.addEventListener("click", (event) => {
  console.log(event);
});

document.getElementById("box").addEventListener("mousemove", (event) => {
  let mouseX;
  let mouseY;

  let targetX;
  let targetY;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  const clock = new THREE.Clock();

  function animate_2() {
    scene.rotation.x += 2 * (targetY - scene.rotation.x);
    scene.rotation.y += 1.5 * (targetX - scene.rotation.y);

    const elapsedTime = clock.getElapsedTime();

    scene.rotation.x = 0 * elapsedTime;
    scene.rotation.y = 0 * elapsedTime;
    scene.rotation.x += 2 * (targetY - scene.rotation.x);
    scene.rotation.y += 1.5 * (targetX - scene.rotation.y);

  }
  animate_2();
});

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputEncoding = THREE.sRGBEncoding;

renderer.setSize(model.clientWidth, model.clientHeight);

scene.castShadow = true;
scene.receiveShadow = true;

// scene.background = new THREE.Color("gray");
/////////////////////
