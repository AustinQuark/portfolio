// Skybox's Author : Hannes Delbeke
// Source : https://sketchfab.com/3d-models/fantasy-sky-background-15c79bb2fc1147128039fe4ff90fd5a0
import * as THREE from "./three.module.js";
import CameraControls from "./camera-controls.module.js";
import { CSS3DRenderer, CSS3DObject  } from "./CSS3DRenderer.js";
import { TWEEN } from "./tween.module.min.js";

var rayon = 1420;
var panelWidth = 1280;
var panelHeight = 720;

const container = document.getElementById("cube_container");

const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(166, 251, 255)");

const camera = new THREE.PerspectiveCamera(55, container.offsetWidth / container.offsetHeight, 1, 1100);
camera.position.x = 1;

//CSS Renderer
const faceRenderer = new CSS3DRenderer({antialias: true});
faceRenderer.domElement.style.borderRadius = "50%";
faceRenderer.domElement.style.position = "absolute";


//Standart Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});
renderer.domElement.style.borderRadius = "50%";
renderer.setPixelRatio(window.devicePixelRatio);


//Skybox Mesh
const skyboxGeometry = new THREE.SphereGeometry(300, 60, 40);
skyboxGeometry.scale(-1, 1, 1);
const skyboxTexture = new THREE.TextureLoader().load("../images/skybox.jpg");
const skyboxMaterial = new THREE.MeshBasicMaterial({ map: skyboxTexture, opacity:0, transparent:true });
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

//Orbit Control for Desktop
CameraControls.install({ THREE: THREE });
var control = new CameraControls(camera, faceRenderer.domElement);
control.enableDamping = true;
control.dollySpeed = 0;
control.truckSpeed = 0;
control.enablePan = false;
control.azimuthRotateSpeed = 0.4;
control.polarRotateSpeed = 0;

container.appendChild(faceRenderer.domElement);
container.appendChild(renderer.domElement);

var panelElems = [];

for (var i = 0; i < 6; i++) {
	var panelElem = document.createElement("div");
	panelElem.className = "panel";
	panelElem.style.width = panelWidth + "px";
	panelElem.style.height = panelHeight + "px";
	panelElem.style.backgroundImage = "url(images/screenshot" + i + ".png)";
	panelElem.style.backgroundSize = "cover";
	panelElem.style.borderRadius = "20px";
	panelElems.push(panelElem);

	var label = new CSS3DObject(panelElem);

	label.position.x = Math.sin((i / 6) * Math.PI * 2) * rayon;
	label.position.y = 0;
	label.position.z = Math.cos((i / 6) * Math.PI * 2) * rayon;

	label.rotation.x = 0;
	label.rotation.y = Math.PI * i / 3 + Math.PI;
	label.rotation.z = 0;

	scene.add(label);

	panelElem.addEventListener("mouseenter", function (e) {
		if (!control.currentAction) control.enabled = false;
	});

	panelElem.addEventListener("mouseleave", function (e) {
		control.enabled = true;
	});
}

scene.add(skybox);

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

const clock = new THREE.Clock();

function animate() {
    const delta = clock.getDelta();
    control.update(delta);
	TWEEN.update();
	const resize = new Resizer(container, camera, renderer, faceRenderer);
	faceRenderer.render(scene, camera);
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

container.classList.add("cube_pop");
new TWEEN.Tween(skyboxMaterial)
    .to({ opacity: 1 }, 3000)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();


var angles = [0, Math.PI * 2 / 6, Math.PI * 4 / 6, Math.PI * 6 / 6, Math.PI * 8 / 6, Math.PI * 10 / 6];

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

control.addEventListener("controlstart", function(e){
	new TWEEN.Tween(camera)
		.to({ fov: 90 }, 500)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(function (camera) {
			camera.updateProjectionMatrix();
		})
		.start();	
});

var selected = 0;

control.addEventListener("control", function (e) {
	var closest = closestAngle(normalizeAngle(control.azimuthAngle)) + Math.PI;
	console.log(closest);

	for (var i = 0; i < angles.length; i++) {
		if (closest == angles[i]) {
			if (selected != i) panelElems[selected].classList.remove("panelSelect");
			selected = i;
			panelElems[selected].classList.add("panelSelect");
		}
	}
});

control.addEventListener("controlend", function (e) {
	new TWEEN.Tween(camera)
		.to({ fov: 55 }, 500)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(function (camera) {
			camera.updateProjectionMatrix();
		})
		.start();

		control.lookInDirectionOf(Math.sin(closestAngle(normalizeAngle(control.azimuthAngle))) * 100, 0, Math.cos(closestAngle(normalizeAngle(control.azimuthAngle))) * 100 , true )
});

animate();