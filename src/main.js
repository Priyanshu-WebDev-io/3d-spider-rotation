import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

// Scene & Camera Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
document.getElementById("model").appendChild(renderer.domElement);

// Lights
const pointLight = new THREE.PointLight("white", 10, 100);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

// Load 3D Model
const loader = new GLTFLoader();
let spiderModel;

loader.load(
  "/Spider_hd.glb",
  function (gltf) {
    spiderModel = gltf.scene;
    spiderModel.scale.set(1, 1, 1);
    scene.add(spiderModel);

    // Add GSAP Animation on Load
    gsap.from(spiderModel.rotation, {
      y: Math.PI * 2,
      duration: 1.5,
      ease: "power2.out",
    });
  },
  (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
  (error) => console.log("Error loading model:", error)
);

// Controls for Both Desktop & Mobile
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = window.innerWidth < 768; // Zoom enabled for mobile, disabled for desktop
controls.enableRotate = true; // Allow rotation

// Mouse & Touch Controls
let isDragging = false;
let prevX = 0, prevY = 0;

const handleDragStart = (event) => {
  isDragging = true;
  prevX = event.clientX || event.touches[0].clientX;
  prevY = event.clientY || event.touches[0].clientY;
};

const handleDragMove = (event) => {
  if (!isDragging || !spiderModel) return;
  event.preventDefault();

  let clientX = event.clientX || event.touches[0].clientX;
  let clientY = event.clientY || event.touches[0].clientY;
  
  let deltaX = (clientX - prevX) * 0.005;
  let deltaY = (clientY - prevY) * 0.005;

  spiderModel.rotation.y += deltaX;
  spiderModel.rotation.x += deltaY;

  prevX = clientX;
  prevY = clientY;
};

const handleDragEnd = () => {
  isDragging = false;
};

document.getElementById("box").addEventListener("mousedown", handleDragStart);
document.getElementById("box").addEventListener("mousemove", handleDragMove);
document.getElementById("box").addEventListener("mouseup", handleDragEnd);

document.getElementById("box").addEventListener("touchstart", handleDragStart);
document.getElementById("box").addEventListener("touchmove", handleDragMove);
document.getElementById("box").addEventListener("touchend", handleDragEnd);

// Gyroscope Support (Mobile Only)
window.addEventListener("deviceorientation", (event) => {
  if (spiderModel && window.innerWidth < 768) {
    let rotationY = event.gamma * 0.002; // Left-right tilt
    let rotationX = event.beta * 0.002; // Front-back tilt

    spiderModel.rotation.y += rotationY;
    spiderModel.rotation.x += rotationX;
  }
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
