var radar = {
    elem: document.getElementById("radar"),
    shape: 0,
    x: 0,
    y: 0
}

radar.shape = radar.elem.getBoundingClientRect();
radar.x = radar.shape.left + radar.shape.width / 2;
radar.y = radar.shape.top + radar.shape.height / 2


var mouse = {
  x: 0,
  y: 0
}

var distance = 0;

var angle = {
    x: 0,
    y: 0
} 

var speedInvert = 50;
var root = document.querySelector(":root");

function rotateCube() {
	angle.x -= mouse.x / speedInvert;
	angle.y -= mouse.y / speedInvert;

	/*angle = 180 * angle/Math.PI;
						angle = 180 +  Math.round(angle) % 360;*/
	root.style.setProperty("--angleX", `${angle.y}deg`, "important");
	root.style.setProperty("--angleY", `${angle.x}deg`, "important");
}

document.addEventListener("mousemove", function(e) { 
    mouse.x = e.clientX - radar.x;
    mouse.y = e.clientY - radar.y;

    distance = Math.sqrt(Math.pow(mouse.x, 2) + Math.pow(mouse.y, 2));

    rotateCube();
});