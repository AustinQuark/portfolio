var radar = {
    elem: document.getElementById("radar"),
    shape: 0,
    x: 0,
    y: 0,
    on: false
}

radar.shape = radar.elem.getBoundingClientRect();
radar.x = radar.shape.left + radar.shape.width / 2;
radar.y = radar.shape.top + radar.shape.height / 2;

var mouse = {
  x: 0,
  y: 0
}

var distance = 0;

var angle = {
    x: 0,
    y: 0
} 

var speed = 1.3;
var root = document.querySelector(":root");

var cubeAngle = {
    x: 0,
    y: 0
}

var rotateInt = false;
var decrementInt = false;


function rotateCube() {
    cubeAngle.x = (cubeAngle.x + angle.x * speed) % 360;
    cubeAngle.y = (cubeAngle.y - angle.y * speed) % 360;
	/*angle = 180 * angle/Math.PI;
						angle = 180 +  Math.round(angle) % 360;*/
	root.style.setProperty("--angleX", `${cubeAngle.y}deg`, "important");
	root.style.setProperty("--angleY", `${cubeAngle.x}deg`, "important");
}

function decrementSpeed() {
    if (Math.abs(angle.x) > 0 || Math.abs(angle.y) > 0)
    {
        angle.x -= Math.sign(angle.x) * 0.01; 
        angle.y -= Math.sign(angle.y) * 0.01;
        rotateCube();
        return ;
    }
    clearInterval(decrementInt);
    decrementInt = false;
}

document.addEventListener("mousemove", function(e) { 
    mouse.x = e.clientX - radar.x;
    mouse.y = e.clientY - radar.y;

    distance = Math.sqrt(Math.pow(mouse.x, 2) + Math.pow(mouse.y, 2));

    if (distance <= radar.shape.width / 2)
    {
        angle.x = mouse.x / distance;
        angle.y = mouse.y / distance;
        if (decrementInt)
        {
            clearInterval(decrementInt);
            decrementInt = false;
        }
        if (!rotateInt)
            rotateInt = setInterval(rotateCube, 15);
        radar.on = true;
    }
    else
    {
        radar.on = false;
        clearInterval(rotateInt);
        rotateInt = false;
        if (!decrementInt)
            decrementInt = setInterval(decrementSpeed, 15); 
    }
});