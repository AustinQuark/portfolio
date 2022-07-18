// Skybox's Author : Hannes Delbeke
// Source : https://sketchfab.com/3d-models/fantasy-sky-background-15c79bb2fc1147128039fe4ff90fd5a0
import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three/examples/jsm/controls/OrbitControls.js";
import { CSS3DRenderer } from "https://unpkg.com/three/examples/jsm/renderers/CSS3DRenderer.js";
import { CSS3DObject } from "https://unpkg.com/three/examples/jsm/renderers/CSS3DRenderer.js";
import { TWEEN } from "https://unpkg.com/three/examples//jsm/libs/tween.module.min";

var cubeSize = 100;

const cubeContainer = document.getElementById("cube_container");

const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(166, 251, 255)");

const camera = new THREE.PerspectiveCamera(65, cubeContainer.offsetWidth / cubeContainer.offsetHeight, 1, 1100);
camera.position.x = cubeSize * 1.7;

//CSS Renderer
const faceRenderer = new CSS3DRenderer({antialias: true});
faceRenderer.domElement.style.borderRadius = "50%";
faceRenderer.domElement.style.position = "absolute";


//Standart Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});
renderer.domElement.style.borderRadius = "50%";


//Cube Mesh
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshBasicMaterial({opacity:0, transparent:true});
const cube = new THREE.Mesh(geometry, material);
cube.scale.set(0,0,0);

//Skybox Mesh
const skyboxGeometry = new THREE.SphereGeometry(300, 60, 40);
skyboxGeometry.scale(-1, 1, 1);
const skyboxTexture = new THREE.TextureLoader().load("skybox.jpg");
const skyboxMaterial = new THREE.MeshBasicMaterial({ map: skyboxTexture, opacity:0, transparent:true });
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

//Orbit Control for Desktop
var control = new OrbitControls(camera, faceRenderer.domElement);
control.enableDamping = true;
control.enableZoom = false;
control.enablePan = false;
control.rotateSpeed = 0.4;

cubeContainer.appendChild(faceRenderer.domElement);
cubeContainer.appendChild(renderer.domElement);

function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4 && rawFile.status == "200") {
			callback(rawFile.responseText);
		}
	};
	rawFile.send(null);
}

readTextFile("./cubeContent.json", function (text) {
	var cubeContent = JSON.parse(text);
	for (var i = 0; i < cubeContent.length; i++) {
		var faceElem = document.createElement("face");
		faceElem.className = "face";
		faceElem.style.width = cubeSize + "px";
		faceElem.style.height = cubeSize + "px";

		var label = new CSS3DObject(faceElem);
		if (i < 4) {
			label.position.x = i % 2 ? 0 : i ? cubeSize / -2 : cubeSize / 2;
			label.position.y = 0;
			label.position.z = !(i % 2) ? 0 : i - 1 ? cubeSize / -2 : cubeSize / 2;

			label.rotation.x = 0;
			label.rotation.y = i == 1 ? 0 : i == 2 ? -Math.PI / 2 : i == 0 ? Math.PI / 2 : Math.PI;
			label.rotation.z = 0;

			if (i == 2) label.rotation.x = -Math.PI;
		} else {
			label.position.x = 0;
			label.position.y = i % 2 ? cubeSize / -2 : cubeSize / 2;
			label.position.z = 0;

			label.rotation.x = -Math.PI / 2;
			label.rotation.y = i == 5 ? Math.PI : 0;
			label.rotation.z = Math.PI / 2;
		}
		var header = document.createElement('h1');
        header.classList.add("faceHeader");
        var description = document.createElement('p');
        description.textContent = cubeContent[i].description;
        description.classList.add("faceDescription");
        var link = document.createElement('a');
        link.textContent = cubeContent[i].header;
        link.href = cubeContent[i].link;
        link.style.textDecoration = "none";
        link.style.color = "inherit";

        header.appendChild(link);
        faceElem.appendChild(header);
        faceElem.appendChild(description);
		cube.add(label);
	}
});
scene.add(cube);
scene.add(skybox);

//Bounce effect
var halfTime = 1000;
const bounce = () => {
	new TWEEN.Tween(cube.position)
		.to({ y: 5 }, halfTime)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.start()
		.onComplete(() => {
			new TWEEN.Tween(cube.position).to({ y: 0 }, halfTime).easing(TWEEN.Easing.Quadratic.InOut).start();
		});
};
bounce();
setInterval(bounce, halfTime * 2);

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

const resize = new Resizer(cubeContainer, camera, renderer, faceRenderer);

function animate() {
	control.update();
	TWEEN.update();
	faceRenderer.render(scene, camera);
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

cubeContainer.classList.add("cube_pop");
new TWEEN.Tween(skyboxMaterial)
    .to({ opacity: 1 }, 3000)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();
new TWEEN.Tween(cube.scale)
    .to({ x: 1, y: 1, z: 1 }, 3000)
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
    .onComplete(() => {cubeContainer.style.transitionDuration = "0s";})
new TWEEN.Tween(cube.rotation)
	.to({ x: 0, y: 6 * Math.PI, z: 4 * Math.PI }, 3000)
	.easing(TWEEN.Easing.Back.Out)
	.start()
	.onComplete(() => {
        document.dispatchEvent(new CustomEvent("fileLoaded"));
	});

animate();