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

var cube = document.getElementById("cube");


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

var squeeze = 1;

function squeezeFunc () {
    if (radar.on)
        squeeze = Math.max(squeeze - 0.04, 0.6);
    else
        squeeze = Math.min(squeeze + 0.04, 1);
}

function rotateCube() {
    cubeAngle.x = (cubeAngle.x + angle.x * speed) % 360;
    cubeAngle.y = (cubeAngle.y - angle.y * speed) % 360;
    squeezeFunc();
	/*angle = 180 * angle/Math.PI;
						angle = 180 +  Math.round(angle) % 360;*/
	root.style.setProperty("--angleX", `${cubeAngle.y}deg`, "important");
	root.style.setProperty("--angleY", `${cubeAngle.x}deg`, "important");
	root.style.setProperty("--squeeze", `${squeeze}`, "important");
}

function decrementSpeed() {
    if (Math.abs(angle.x) > 0 || Math.abs(angle.y) > 0)
    {  
        angle.x -= Math.sign(angle.x) * 0.005; 
        angle.y -= Math.sign(angle.y) * 0.005;
        rotateCube();
        return ;
    }
    clearInterval(decrementInt);
    decrementInt = false;
}

function focusFace() {
    root.style.setProperty("--angleX", `0deg`, "important");
    root.style.setProperty("--angleY", `0deg`, "important");

    cube.style.animation="showRight 1s linear";

}

document.addEventListener("mousemove", function(e) { 
    mouse.x = e.clientX - radar.x;
    mouse.y = e.clientY - radar.y;

    distance = Math.sqrt(Math.pow(mouse.x, 2) + Math.pow(mouse.y, 2));

    if (distance <= radar.shape.width / 2)
    {
        if (distance <= radar.shape.width / 5)
        {
            clearInterval(rotateInt);
            rotateInt = false;
            focusFace();
        }
        else
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