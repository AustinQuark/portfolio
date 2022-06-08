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
var focusInt = false;

var squeeze = 1;

function squeezeFunc () {
    if (radar.on && !focusInt)
        squeeze = Math.max(squeeze - 0.04, 0.7);
    else
        squeeze = Math.min(squeeze + 0.01, 1);
}

function setNewAngle () {
	root.style.setProperty("--angleX", `${cubeAngle.x}deg`, "important");
	root.style.setProperty("--angleY", `${cubeAngle.y}deg`, "important");
	root.style.setProperty("--squeeze", `${squeeze}`, "important");
}

function rotateCube() {
    cubeAngle.x = (cubeAngle.x + angle.x * speed) % 360;
    cubeAngle.y = (cubeAngle.y - angle.y * speed) % 360;
    squeezeFunc();
	/*angle = 180 * angle/Math.PI;
						angle = 180 +  Math.round(angle) % 360;*/
    setNewAngle();
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

var roundFaces = [0, 90, 180, 270, 360, -90, -180, -270, -360];

function focusFace(faceX, faceY) {

    if (cubeAngle.x != faceX || cubeAngle.y != faceY)
    {
        if (Math.round(cubeAngle.x) == faceX)
            cubeAngle.x = faceX;
        else
            cubeAngle.x -= Math.sign(cubeAngle.x - faceX);
        if (Math.round(cubeAngle.y) == faceY)
            cubeAngle.y = faceY;
        else
            cubeAngle.y -= Math.sign(cubeAngle.y - faceY);


        console.log(cubeAngle.x, cubeAngle.y);
        squeezeFunc();  
        setNewAngle();  
        return ;
    }
    clearInterval(focusInt);
    focusInt = false;
    console.log("al")

}

document.addEventListener("mousemove", function(e) { 
    mouse.x = e.clientX - radar.x;
    mouse.y = e.clientY - radar.y;

    distance = Math.sqrt(Math.pow(mouse.x, 2) + Math.pow(mouse.y, 2));

    if (distance <= radar.shape.width / 2)
    {
        if (distance <= radar.shape.width / 10)
        {
            clearInterval(rotateInt);
            rotateInt = false;
            if (!focusInt)
            {
                var closestFaceX = roundFaces.reduce(function(prev, curr) {
                    return (Math.abs(curr - cubeAngle.x) < Math.abs(prev - cubeAngle.x)? curr : prev);});

                var closestFaceY = roundFaces.reduce(function(prev, curr) {
                    return (Math.abs(curr - cubeAngle.y) < Math.abs(prev - cubeAngle.y) ? curr : prev);});

                focusInt = setInterval(focusFace, 15, closestFaceX, closestFaceY);
            }
        }
        else
        {
            if (focusInt)
            {
                clearInterval(focusInt);
                focusInt = false;
            }   
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
var square = document.getElementById("square");


if (window.matchMedia("(min-width: 768px)").matches) {
    square.scrollIntoView({block: "center"});
} else {
    cube.scrollIntoView({block: "center"});
    
}