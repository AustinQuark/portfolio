import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three/examples/jsm/controls/OrbitControls.js";
import { CSS3DRenderer } from "https://unpkg.com/three/examples/jsm/renderers/CSS3DRenderer.js";
import { CSS3DObject } from "https://unpkg.com/three/examples/jsm/renderers/CSS3DRenderer.js";
import { TWEEN } from "https://unpkg.com/three/examples//jsm/libs/tween.module.min";

//Scene Units
var cubeSize = 100;

const cubeContainer = document.getElementById("cube_container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(70, cubeContainer.offsetWidth / cubeContainer.offsetHeight, 1, 1100);
camera.position.x = cubeSize * 1.7;

const faceRenderer = new CSS3DRenderer({alpha: true});
faceRenderer.setSize(cubeContainer.offsetWidth, cubeContainer.offsetHeight);
faceRenderer.domElement.style.borderRadius = "50%";
faceRenderer.domElement.style.position = "absolute";

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(cubeContainer.offsetWidth, cubeContainer.offsetHeight);
renderer.domElement.style.borderRadius = "50%";

const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshBasicMaterial();
const cube = new THREE.Mesh(geometry, material);

const skyboxGeometry = new THREE.SphereGeometry(300, 60, 40);
skyboxGeometry.scale(-1, 1, 1);
const skyboxTexture = new THREE.TextureLoader().load("skybox.jpg");
const skyboxMaterial = new THREE.MeshBasicMaterial({ map: skyboxTexture });

const skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

var isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

//Desktop followed by Mobile camera gestion.

var control = new OrbitControls(camera, faceRenderer.domElement);
control.enableDamping = true;
control.enableZoom = false;
control.enablePan = false;
control.rotateSpeed = 0.4;

if (isTouch) {
	control.enabled = false;

	// Source : https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
	cubeContainer.addEventListener("touchstart", handleTouchStart, false);
	cubeContainer.addEventListener("touchmove", handleTouchMove, false);

    function preventDefault(e) {
		e.preventDefault();
	}
    var supportsPassive = false;
    var wheelOpt = supportsPassive ? { passive: false } : false;
    try {
        window.addEventListener(
            "test",
            null,
            Object.defineProperty({}, "passive", {
                get: function () {
                    supportsPassive = true;
                },
            })
        );
    } catch (e) {}
	cubeContainer.addEventListener("touchstart", preventDefault, wheelOpt);
    cubeContainer.removeEventListener("touchend", preventDefault, wheelOpt);
}


var xDown = null;
var yDown = null;
var tweening = false;


function getTouches(evt) {
	return (
		evt.touches || // browser API
		evt.originalEvent.touches
	); // jQuery
}

function handleTouchStart(evt) {
	const firstTouch = getTouches(evt)[0];
	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
	if (!xDown || !yDown) {
		return;
	}
	var xSwipe = 0;
	var ySwipe = 0;

	var xUp = evt.touches[0].clientX;
	var yUp = evt.touches[0].clientY;

	var xDiff = xDown - xUp;
	var yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {
		/*most significant*/
		if (xDiff > 0) {
			xSwipe = Math.PI / -2;
		} else {
			xSwipe = Math.PI / 2;
		}
	} else {
		if (yDiff > 0) {
			ySwipe = Math.PI / 2;
		} else {
			ySwipe = Math.PI / -2;
		}
	}

	var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, xSwipe, ySwipe, "XYZ"));
	deltaRotationQuaternion.multiply(cube.quaternion);
	var rotation = new THREE.Euler().setFromQuaternion(deltaRotationQuaternion, "XYZ");

    if (!tweening) {
        tweening = true;
	    new TWEEN.Tween(cube.rotation)
        .to({ y: rotation.y, z: rotation.z }, 1500)
        .easing(TWEEN.Easing.Back.InOut)
        .start()
        .onComplete(() => { tweening = false;});
    }

	/* reset values */
	xDown = null;
	yDown = null;
}

cubeContainer.appendChild(faceRenderer.domElement);
cubeContainer.appendChild(renderer.domElement);

var cubeFile = new XMLHttpRequest();
cubeFile.open("GET", "./cubeContent.json", true);
cubeFile.onreadystatechange = function () {
	var cubeContent = JSON.parse(cubeFile.responseText);

	for (var i = 0; i < cubeContent.length; i++) {
		var faceElem = document.createElement("front");
		faceElem.className = "face";
		faceElem.style.position = "absolute";
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

			if (i == 2 && isTouch) label.rotation.x = -Math.PI;
		} else {
			label.position.x = 0;
			label.position.y = i % 2 ? cubeSize / -2 : cubeSize / 2;
			label.position.z = 0;

			label.rotation.x = -Math.PI / 2;
			label.rotation.y = i == 5 ? Math.PI : 0;
			label.rotation.z = Math.PI / 2;
		}
		faceElem.textContent = cubeContent[i].side;

		cube.add(label);
	}
};
cubeFile.send(null);

scene.add(cube);
scene.add(skyboxMesh);

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

function animate() {
	requestAnimationFrame(animate);
	control.update();
	TWEEN.update();
	faceRenderer.render(scene, camera);
	renderer.render(scene, camera);
}

animate();