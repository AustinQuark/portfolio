import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three/examples/jsm/controls/OrbitControls.js";
import { CSS3DRenderer } from "https://unpkg.com/three/examples/jsm/renderers/CSS3DRenderer.js";
import { CSS3DObject } from "https://unpkg.com/three/examples/jsm/renderers/CSS3DRenderer.js";

//Scene Units
var cubeSize = 100;

const cubeContainer = document.getElementById("cube_container");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6fff1);

const camera = new THREE.PerspectiveCamera(70, cubeContainer.offsetWidth / cubeContainer.offsetHeight);
camera.position.x = cubeSize * 1.5;


const faceRenderer = new CSS3DRenderer({antialias: true});
faceRenderer.setSize(cubeContainer.offsetWidth, cubeContainer.offsetHeight);
faceRenderer.domElement.style.borderRadius = "50%";
faceRenderer.domElement.style.position = "absolute";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(cubeContainer.offsetWidth, cubeContainer.offsetHeight);
renderer.domElement.style.borderRadius = "50%";

var control = new OrbitControls(camera, faceRenderer.domElement);
control.enableDamping = true;
control.enableZoom = false;

const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshBasicMaterial({ color: 0x414141 });
const cube = new THREE.Mesh(geometry, material);

cubeContainer.appendChild(faceRenderer.domElement);
cubeContainer.appendChild(renderer.domElement);



var cubeFile= new XMLHttpRequest();
cubeFile.open("GET", './cubeContent.json', true);
cubeFile.onreadystatechange = function ()
    {
       var cubeContent = JSON.parse(cubeFile.responseText);

       for (var i = 0; i < cubeContent.length; i++)
       {
        var faceElem = document.createElement("front");
        faceElem.className = "face";
        faceElem.style.position = "absolute";
        faceElem.textContent = cubeContent[i].header;
        faceElem.style.width = cubeSize + 'px';
        faceElem.style.height = cubeSize + 'px';
        
        var label = new CSS3DObject(faceElem);
        label.position.copy(new THREE.Vector3(cubeSize / 2 * i, 0, 0));
        label.rotation.z = 0;
        label.rotation.y = 0;
        cube.add(label);

       }
        
    }
cubeFile.send(null);

scene.add(cube);

function animate() {
	requestAnimationFrame(animate);
	control.update();
	renderer.render(scene, camera);
    faceRenderer.render(scene, camera);
}

animate();

function toRadians(angle) {
	return angle * (Math.PI / 180);
}
function toDegrees(angle) {
	return angle * (180 / Math.PI);
}

/*
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cubeContainer = document.getElementById("cube_container");

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
cubeContainer.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x414141 });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 5;

var isDragging = false;
var previousMousePosition = { x: 0, y: 0 };
var deltaMove = {x: 0, y: 0};

renderer.domElement.addEventListener("mousedown", function(e) {
    isDragging = true;
});

renderer.domElement.addEventListener("mouseup", function(e) {
    isDragging = false;
})

renderer.domElement.addEventListener("mousemove", function(e) {
    deltaMove.x = e.offsetX - previousMousePosition.x;
    deltaMove.y = e.offsetY - previousMousePosition.y;

    previousMousePosition.x = e.offsetX;
    previousMousePosition.y = e.offsetY;
});

window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60); };
})();

var lastFrameTime = new Date().getTime() / 1000;
var totalTime = 0;

function update(dt, t) {
    setTimeout(function() {
        var currentTime = new Date().getTime() / 1000;
        var dt = currentTime - (lastFrameTime || currentTime);
        totalTime += dt;

        update(dt, totalTime);
        lastFrameTime = currentTime;
    }, 0);
}

var move = { x: 0, y: 0};
var speed = 0.2;
var inertia = 2; //lower is higher

function animate() {
    if (!isDragging) {
        move.x = move.x > 0 ? Math.max(0, move.x - inertia) : Math.min(0, move.x + inertia);
        move.y = move.y > 0 ? Math.max(0, move.y - inertia) : Math.min(0, move.y + inertia);
    }
    else {
        move.x = deltaMove.x;
        move.y = deltaMove.y;
    }

    var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(toRadians(move.y * speed), toRadians(move.x * speed), 0, "XYZ")
    );
    cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

animate();
update(0, totalTime);

function toRadians (angle) { return angle * (Math.PI / 180);}
function toDegrees(angle) { return angle * (180 / Math.PI);}
*/
