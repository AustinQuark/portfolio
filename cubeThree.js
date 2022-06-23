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

    if (isDragging) {
        var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler( new THREE.Euler(
            toRadians(deltaMove.y * 0.5),
            toRadians(deltaMove.x * 0.5),
            0,
            'XYZ'
        ));
        cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
    }

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

function animate() {
	renderer.render(scene, camera);

	requestAnimationFrame(animate);
}

animate();
update(0, totalTime);

function toRadians (angle) { return angle * (Math.PI / 180);}
function toDegrees(angle) { return angle * (180 / Math.PI);}