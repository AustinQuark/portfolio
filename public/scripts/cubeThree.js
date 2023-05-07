// Skybox's Author : Hannes Delbeke
// Source : https://sketchfab.com/3d-models/fantasy-sky-background-15c79bb2fc1147128039fe4ff90fd5a0
import * as THREE from "./three.module.js";
import CameraControls from "./camera-controls.module.js";
import { CSS3DRenderer, CSS3DObject  } from "./CSS3DRenderer.js";
import { TWEEN } from "./tween.module.min.js";

//Variables
const rayon = 1420;
const panelWidth = 1280;
const panelHeight = 720;
var panelElems = [];
var panelObjects = [];
const angles = [0, Math.PI * 2 / 6, Math.PI * 4 / 6, Math.PI * 6 / 6, Math.PI * 8 / 6, Math.PI * 10 / 6];
const links = [
    'https://github.com/AustinQuark/cub3D',
	'https://austinquark.com/',
    'https://github.com/AustinQuark/push_swap',
	'https://github.com/AustinQuark/philosophers',
	'https://projectbar-events.com',
    'https://github.com/AustinQuark/minishell_42'
];

//WebP support
function support_format_webp()
{
	var elem = document.createElement('canvas');

	if (!!(elem.getContext && elem.getContext('2d')))
		return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
	else
		return false;
}

var webpSupport = support_format_webp();

//DOM Container
const container = document.getElementById("cube_container");
container.style.overflow = "hidden";

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(166, 251, 255)");

//Camera
const camera = new THREE.PerspectiveCamera(55, container.offsetWidth / container.offsetHeight, 1200, 1600);
camera.position.x = 1;
camera.position.y = 0;
camera.position.z = 0;

//CSS Renderer
const faceRenderer = new CSS3DRenderer({antialias: false, depth: false});
faceRenderer.domElement.style.position = "absolute";
faceRenderer.domElement.style.zIndex = "1";

//Standard Renderer
const renderer = new THREE.WebGLRenderer({ antialias: false , alpha: true});
renderer.domElement.style.borderRadius = "50%";
renderer.domElement.style.webkitTransition = "all 0.5s ease-in-out";
renderer.domElement.style.zIndex = "10";
renderer.domElement.style.boxShadow = "0px 0px 0px 0px #66c6d300 !important; -webkit-box-shadow: 0px 0px 0px 0px #66c6d300 !important;";
renderer.domElement.style.transition = "all 1.25s cubic-bezier(0.65, 0, 0.35, 1);"
renderer.setPixelRatio(window.devicePixelRatio);


//Skybox
const skyboxGeometry = new THREE.SphereGeometry(1599, 60, 40);
skyboxGeometry.scale(-1, 1, 1);
var skyboxFile = (webpSupport) ? "../images/skybox.webp" : "../images/skybox.jpg";
const skyboxTexture = new THREE.TextureLoader().load(skyboxFile);
const skyboxMaterial = new THREE.MeshBasicMaterial({ map: skyboxTexture, opacity:0, transparent:true });
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);


//Orbit Control
CameraControls.install({ THREE: THREE });
var control = new CameraControls(camera, faceRenderer.domElement);
control.enableDamping = false;
control.dollySpeed = 0;
control.truckSpeed = 0;
control.enablePan = false;
control.azimuthRotateSpeed = 0.3;
control.polarRotateSpeed = 0;
control.draggingSmoothTime = 0.1;
control.azimuthAngle = 0;

container.appendChild(faceRenderer.domElement);
container.appendChild(renderer.domElement);


//Setup Screens
for (var i = 0; i < 6; i++) {
	var panelElem = document.createElement("div");

	panelElem.className = "panel";
	panelElem.classList.add("panel_shadow");
	panelElem.style.width = panelWidth + "px";
	panelElem.style.height = panelHeight + "px";
	var panelFile = (webpSupport) ? "url(images/screenshot" + i + ".webp)" : "url(images/screenshot" + i + ".png)";
	panelElem.style.backgroundImage = panelFile;

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
linkPanel.classList.add("linkPanel_hover");
linkPanel.style.width = panelWidth * 0.65 + "px";
linkPanel.style.height = panelHeight * 0.3 + "px";

var linkContent = document.createElement("a");
linkContent.className = "linkContent";
linkPanel.classList.add("linkContent_hover");
linkContent.target = "_blank";
linkPanel.appendChild(linkContent);

var linkLabel = new CSS3DObject(linkPanel);
linkLabel.position.y = -panelHeight * 2;
linkLabel.rotation.x = 0;
linkLabel.rotation.z = 0;

//Reposition Link Button depending on control.azimuthAngle
function linkPanelPlacement() {
	linkLabel.position.x = Math.sin(control.azimuthAngle + Math.PI) * rayon;
	linkLabel.position.z = Math.cos(control.azimuthAngle + Math.PI) * rayon;
	linkLabel.rotation.y = control.azimuthAngle;
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

linkContent.addEventListener("touchstart", function (e) {
	control.enabled = false;
});

window.addEventListener("focus", function (e) {
	control.enabled = true;
});

window.addEventListener("blur", function (e) {
	linkPanel.classList.remove("linkPanel_hover");
	linkContent.classList.remove("linkContent_hover");
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
	TWEEN.update();
    control.update(delta);
	new Resizer(container, camera, renderer, faceRenderer);
	faceRenderer.render(scene, camera);
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

//Start Animation
container.classList.add("cube_pop");

new TWEEN.Tween(skyboxMaterial)
    .to({ opacity: 1 }, 800)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();


var continuousTurn = new TWEEN.Tween(control)
				.to({ azimuthAngle: Math.PI * 2 }, 30000)
				.easing(TWEEN.Easing.Linear.None)
				.repeat(Infinity)
				.start();



//Link Panel Animation
var linkDown = new TWEEN.Tween(linkLabel.position)
			.to({ y: -panelHeight * 1.5 }, 500)
			.easing(TWEEN.Easing.Exponential.Out);

var linkUp = new TWEEN.Tween(linkLabel.position)
			.to({ y: -panelHeight * 0.7 }, 400)
			.easing(TWEEN.Easing.Cubic.InOut);


//Camera Fov Animation
var camUnzoom = new TWEEN.Tween(camera)
				.to({ fov: 65 }, 500)
				.easing(TWEEN.Easing.Quartic.Out)
				.onUpdate(function (camera) {camera.updateProjectionMatrix();});

var camZoom = new TWEEN.Tween(camera)
			.to({ fov: 50 }, 600)
			.easing(TWEEN.Easing.Quintic.InOut)
			.onUpdate(function (camera) {camera.updateProjectionMatrix();});



control.addEventListener("controlstart", function(e){
	if (continuousTurn.isPlaying) continuousTurn.stop();

	if (renderer.domElement.classList.contains("light")) renderer.domElement.classList.toggle("light");

	container.style.overflow = "hidden";
	
	if (linkUp.isPlaying) linkUp.stop();
	linkDown.start();
	
	if (camZoom.isPlaying) camZoom.stop();
	camUnzoom.start();
});

control.addEventListener("controlend", function (e) {
	
	if (linkDown.isPlaying) linkDown.stop();
	linkUp.start();
	
	control.lookInDirectionOf(Math.sin(closestAngle(normalizeAngle(control.azimuthAngle))) * 100, 0, Math.cos(closestAngle(normalizeAngle(control.azimuthAngle))) * 100 , true );
	setTimeout(function () {
		if (!renderer.domElement.classList.contains("light")) renderer.domElement.classList.toggle("light");
		
		if (panelElems[selected].classList.contains("panelSelect")) 
		{
			panelElems[selected].classList.remove("panelSelect");
			panelElems[selected].classList.add("panelIdle");
		}

		if (camUnzoom.isPlaying) camUnzoom.stop();
		camZoom.start();

		setTimeout(function () {
			container.style.overflow = "visible";
		}, 300);

	}, 275);
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
	linkPanelPlacement();

	var closest = closestAngle(normalizeAngle(control.azimuthAngle)) + Math.PI;

	for (var i = 0; i < angles.length; i++) {

		if (closest.toFixed(1) == angles[i].toFixed(1) && selected != i) {
			if (selected != -1)
			{
				panelElems[selected].classList.remove("panelSelect");
			}
			selected = (i + 3) % 6;
			if (!renderer.domElement.classList.contains("light"))
			{
				panelElems[selected].classList.add("panelSelect");
				panelElems[selected].classList.remove("panelIdle");
			}
			linkContent.href = links[selected];
			if (selected == 1) 
				linkContent.innerHTML = "Inception";
			else
				linkContent.innerHTML = "Check My Work";
			break;
		}
	}
}

control.addEventListener("update", throttle(panelDetect, 10));

animate();