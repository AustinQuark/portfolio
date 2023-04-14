// Skybox's Author : Hannes Delbeke
// Source : https://sketchfab.com/3d-models/fantasy-sky-background-15c79bb2fc1147128039fe4ff90fd5a0
import * as THREE from "./three.module.js";
import CameraControls from "./camera-controls.module.js";
import { CSS3DRenderer, CSS3DObject  } from "./CSS3DRenderer.js";
import { TWEEN } from "./tween.module.min.js";

//Variables
var rayon = 1420;
var panelWidth = 1280;
var panelHeight = 720;
var panelElems = [];
var panelObjects = [];
var angles = [0, Math.PI * 2 / 6, Math.PI * 4 / 6, Math.PI * 6 / 6, Math.PI * 8 / 6, Math.PI * 10 / 6];

//DOM Container
const container = document.getElementById("cube_container");

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(166, 251, 255)");

//Camera
const camera = new THREE.PerspectiveCamera(55, container.offsetWidth / container.offsetHeight, 1, 10000);
camera.position.x = 1;

//CSS Renderer
const faceRenderer = new CSS3DRenderer({antialias: true});
faceRenderer.domElement.style.borderRadius = "50%";
faceRenderer.domElement.style.position = "absolute";

//Standard Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});
renderer.domElement.style.borderRadius = "50%";
renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(faceRenderer.domElement);
container.appendChild(renderer.domElement);

//Skybox
const skyboxGeometry = new THREE.SphereGeometry(7000, 60, 40);
skyboxGeometry.scale(-1, 1, 1);
const skyboxTexture = new THREE.TextureLoader().load("../images/skybox.jpg");
const skyboxMaterial = new THREE.MeshBasicMaterial({ map: skyboxTexture, opacity:0, transparent:true });
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

//Orbit Control
CameraControls.install({ THREE: THREE });
var control = new CameraControls(camera, faceRenderer.domElement);
control.enableDamping = true;
control.dollySpeed = 0;
control.truckSpeed = 0;
control.enablePan = false;
control.azimuthRotateSpeed = 0.3;
control.polarRotateSpeed = 0;
control.draggingSmoothTime = 0.1;

//Setup Screens
for (var i = 0; i < 6; i++) {
	var panelElem = document.createElement("div");

	panelElem.className = "panel";
	panelElem.style.width = panelWidth + "px";
	panelElem.style.height = panelHeight + "px";
	panelElem.style.backgroundImage = "url(images/screenshot" + i + ".png)";
	panelElem.style.backgroundSize = "cover";
	panelElem.style.borderRadius = "20px";


	var label = new CSS3DObject(panelElem);

	label.position.x = Math.sin((i / 6) * Math.PI * 2) * rayon;
	label.position.y = 0;
	label.position.z = Math.cos((i / 6) * Math.PI * 2) * rayon;
	label.rotation.x = 0;
	label.rotation.y = Math.PI * i / 3;
	label.rotation.z = 0;
	label.scale.x = -1;

	panelElems.push(panelElem);
	panelObjects.push(label);

	scene.add(label);
}

//Link Button
var linkPanel = document.createElement("div");
linkPanel.className = "linkPanel";
linkPanel.style.width = panelWidth * 0.8 + "px";
linkPanel.style.height = panelHeight * 0.3 + "px";

var linkLabel = new CSS3DObject(linkPanel);
linkLabel.position.y = -panelHeight * 0.9;
linkLabel.rotation.x = 0;
linkLabel.rotation.z = 0;

//Reposition Link Button depending on control.azimuthAngle
function linkPanelPlacement() {
	linkLabel.position.x = Math.sin(control.azimuthAngle + Math.PI) * rayon;
	linkLabel.position.z = Math.cos(control.azimuthAngle + Math.PI) * rayon;
	linkLabel.rotation.y = control.azimuthAngle + Math.PI;
}

linkPanelPlacement();

scene.add(linkLabel);

//Link Button Event Listener
linkPanel.addEventListener("mouseenter", function (e) {
	if (!control.currentAction) control.enabled = false;
});

linkPanel.addEventListener("mouseleave", function (e) {
	control.enabled = true;
});

//Resizer (source : https://discoverthreejs.com/book/first-steps/responsive-design/)
const setSize = (container, camera, renderer, faceRenderer) => {
	camera.aspect = container.clientWidth / container.clientHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
    faceRenderer.setSize(container.clientWidth, container.clientHeight);
};

class Resizer {
	constructor(container, camera, renderer, faceRenderer) {
		// set initial size
		setSize(container, camera, renderer, faceRenderer);

		window.addEventListener("resize", () => {
			// set the size again if a resize occurs
			setSize(container, camera, renderer, faceRenderer);
		});
	}
}

//Closest Angle
function closestAngle(angle) {
	var closest = angles[0];
	for (var i = 0; i < angles.length; i++) {
		if (Math.abs(angle - angles[i]) < Math.abs(angle - closest)) {
			closest = angles[i];
			if (i == 5 && Math.abs(2 * Math.PI - angle) < Math.abs(angle - closest)) closest = 0;
		}
	}
	return closest - Math.PI;
}

function normalizeAngle( angle ) {
	return THREE.MathUtils.euclideanModulo( angle, 2 * Math.PI );
}

const clock = new THREE.Clock();

//The Loop
function animate() {
    const delta = clock.getDelta();
    control.update(delta);
	TWEEN.update();
	new Resizer(container, camera, renderer, faceRenderer);
	faceRenderer.render(scene, camera);
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

//Start Animation
container.classList.add("cube_pop");
new TWEEN.Tween(skyboxMaterial)
    .to({ opacity: 1 }, 3000)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();


control.addEventListener("controlstart", function(e){
	if (container.classList.contains("light")) {
		container.classList.toggle("light");
	};

	setTimeout(function () { 
		linkPanel.style.opacity = 0;

		new TWEEN.Tween(linkLabel.position)
		.to({ y: -panelHeight * 2 }, 500)
		.easing(TWEEN.Easing.Cubic.Out)
		.start();

	}, 0);

	faceRenderer.domElement.style.borderRadius = "50%";

	new TWEEN.Tween(camera)
		.to({ fov: 65 }, 500)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(function (camera) {
			camera.updateProjectionMatrix();
		})
		.start();
	

});

control.addEventListener("controlend", function (e) {
		
	new TWEEN.Tween(camera)
	.to({ fov: 55 }, 500)
	.easing(TWEEN.Easing.Cubic.Out)
	.onUpdate(function (camera) {
		camera.updateProjectionMatrix();
	})
	.start();
	

	control.lookInDirectionOf(Math.sin(closestAngle(normalizeAngle(control.azimuthAngle))) * 100, 0, Math.cos(closestAngle(normalizeAngle(control.azimuthAngle))) * 100 , true );
	container.classList.toggle("light");

	setTimeout(function () { 
		linkPanel.style.opacity = 1;

		new TWEEN.Tween(linkLabel.position)
		.to({ y: -panelHeight * 0.9 }, 300)
		.easing(TWEEN.Easing.Cubic.Out)
		.start();
		
		faceRenderer.domElement.style.borderRadius = "0";

	}, 500);

});

function throttle(func, delay) {
	let lastCall = 0;
	return function() {
	  const now = new Date().getTime();
	  if (now - lastCall < delay) {
		return;
	  }
	  lastCall = now;
	  func.apply(this, arguments);
	}
  }

var selected = -1;

function panelDetect(){
	var closest = closestAngle(normalizeAngle(control.azimuthAngle)) + Math.PI;

	for (var i = 0; i < angles.length; i++) {

		if (closest.toFixed(1) == angles[i].toFixed(1) && selected != i) {
			if (selected != -1)
			{
				panelElems[selected].classList.remove("panelSelect");
			}
			selected = (i + 3) % 6;
			panelElems[selected].classList.add("panelSelect");
		}
	}
	linkPanelPlacement();
}
  

control.addEventListener("update", throttle(panelDetect, 10));

animate();