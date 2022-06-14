var radar = {   x: 0,
                y: 0, 
                elem: document.getElementById("radar"), 
                shape: 0
            };

radar.shape = radar.elem.getBoundingClientRect();
radar.x = radar.shape.left + radar.shape.width / 2;
radar.y = radar.shape.top + radar.shape.height / 2;

var mouseRaw = {x: 0, y: 0};
var mouse = {x: 0, y: 0};

var distance = 0;

var angle = {x: 0, y: 0};
var cubeAngle = {x: 0, y: 0};
var squeeze = 1;

var time = {now: new Date().getTime(), diff: 0}

var root = document.querySelector(":root");
var cube = document.getElementById("cube");
var square = document.getElementById("square");

if (window.matchMedia("(min-width: 768px)").matches) {
    square.scrollIntoView({block: "center"});
} else {
    cube.scrollIntoView({block: "center"});
}

var face = null;
var roundFaces = [["left", 90, 360],
                ["front", 360, 360],
                ["right", 270, 360],
                ["back", 180, 360],
                ["top", 360, 270],
                ["bottom", 360, 90]];

//States
var onRadar = false;
var onFocus = false;
var focused = false;

var focusFaceX;
var focusFaceY;

//Speeds ( in ms^-1 )
var speed = 0.1; 
var decrementSpeed = 0.001;
var squeezeSpeed = 0.0015;

var focusSpeed;


function isOnRadar() {
	if (document.elementFromPoint(mouseRaw.x, mouseRaw.y) == radar.elem) return true;
	return false;
}

function easeInExpo(x){
	return x === 0 ? 0 : (Math.pow(2, 10 * x - 10) + 1) / 2;
}

function setNewAngle() {
	root.style.setProperty("--angleX", `${cubeAngle.x}deg`);
	root.style.setProperty("--angleY", `${cubeAngle.y}deg`);
    root.style.setProperty("--squeeze", `${easeInExpo(squeeze)}`);
}

cube.addEventListener("transitionend", function () {
		cube.classList.remove("focus");
        angle.y = 0;
        angle.x = 0;
        cubeAngle.x = focusFaceX;
        cubeAngle.y = focusFaceY;
		onFocus = false;
});

document.addEventListener("click", function(e) {
    face = document.elementFromPoint(mouseRaw.x, mouseRaw.y);
    if (face.classList.contains("face") && !onFocus)
    {
        for(var i = 0; i < roundFaces.length; i++)
        {
            if (face.classList.contains(roundFaces[i][0]))
            {  
                focusFaceX = roundFaces[i][1];
                focusFaceY = roundFaces[i][2];

                if (cubeAngle.x < 0) focusFaceX -= 360;
                if (cubeAngle.y < 0) focusFaceY -= 360;

                onFocus = true;
                break ;
            }
        }
    }
})


document.addEventListener("mousemove", function(e) {
    mouseRaw.x = e.clientX;
    mouseRaw.y = e.clientY;
})

function rotateCube () {
    time.diff = new Date().getTime() - time.now;
    time.now += time.diff;

    mouse.x = mouseRaw.x - radar.x;
    mouse.y = mouseRaw.y - radar.y;

    onRadar = isOnRadar();
    distance = Math.sqrt(Math.pow(mouse.x, 2) + Math.pow(mouse.y, 2));

    if (onFocus)
    {
        if (!cube.classList.contains("focus"))
        {
			cube.classList.add("focus");
            root.style.setProperty("--angleX", `${focusFaceX}deg`);
            root.style.setProperty("--angleY", `${focusFaceY}deg`);
		}
        squeeze = Math.min(squeeze + squeezeSpeed * time.diff, 1);
    } 
    else
    {
        if (onRadar)
        {
            angle.x = mouse.x / distance;
            angle.y = mouse.y / distance;
            squeeze = Math.max(squeeze - squeezeSpeed * time.diff, 0.6);
        }
        else //if (onNothing)
        {
            if (angle.x > 0)
                angle.x = Math.max(angle.x - decrementSpeed * time.diff, 0);
            else if (angle.x < 0)
                angle.x = Math.min(angle.x + decrementSpeed * time.diff, 0);

            if (angle.y > 0)
                angle.y = Math.max(angle.y - decrementSpeed * time.diff, 0);
            else if (angle.y < 0)
                angle.y = Math.min(angle.y + decrementSpeed * time.diff, 0);
        }
        cubeAngle.x = (cubeAngle.x + angle.x * time.diff * speed) % 360;
        cubeAngle.y = (cubeAngle.y + angle.y * time.diff * speed) % 360;
        setNewAngle();
    }
}

setInterval(rotateCube, 15); //Default 15

/*
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
var startInt = false;

var squeeze = 1;

function squeezeFunc () {
    if (radar.on && !focusInt)
        squeeze = Math.max(squeeze - 0.04, 0.7);
    else
        squeeze = Math.min(squeeze + 0.05, 1);
}

function setNewAngle () {
	root.style.setProperty("--angleX", `${cubeAngle.x}deg`);
	root.style.setProperty("--angleY", `${cubeAngle.y}deg`);
	root.style.setProperty("--squeeze", `${squeeze}`);
}

function rotateCube() {
    cubeAngle.x = (cubeAngle.x + angle.x * speed) % 360;
    cubeAngle.y = (cubeAngle.y - angle.y * speed) % 360;
    squeezeFunc();
	//angle = 180 * angle/Math.PI;
	//					angle = 180 +  Math.round(angle) % 360;
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

function focusFace(faceX,focusFaceY) {

    if (cubeAngle.x != faceX || cubeAngle.y !=focusFaceY)
    {
        if (Math.round(cubeAngle.x) == faceX)
            cubeAngle.x = faceX;
        else
            cubeAngle.x -= Math.sign(cubeAngle.x - faceX);
        if (Math.round(cubeAngle.y) ==focusFaceY)
            cubeAngle.y =focusFaceY);
        else
            cubeAngle.y -= Math.sign(cubeAngle.y -focusFaceY);


        squeezeFunc();  
        setNewAngle();  
        return ;
    }
    clearInterval(focusInt);
    focusInt = false;
}

var faces = document.getElementsByClassName("face");

document.addEventListener("mousemove", function(e) { 
    mouse.x = e.clientX - radar.x;
    mouse.y = e.clientY - radar.y;

    distance = Math.sqrt(Math.pow(mouse.x, 2) + Math.pow(mouse.y, 2));

    if (document.elementFromPoint(e.clientX, e.clientY) == radar.elem ||
        cube.contains(document.elementFromPoint(e.clientX, e.clientY)))
    {
        if (startInt)
        {
            clearInterval(startInt);
            startInt = false;
        }
        if (cube.contains(document.elementFromPoint(e.clientX, e.clientY)))
        {
            clearInterval(rotateInt);
            rotateInt = false;
            if (!focusInt)
            {
                var focusFaceX = roundFaces.reduce(function(prev, curr) {
                    return (Math.abs(curr - cubeAngle.x) < Math.abs(prev - cubeAngle.x)? curr : prev);});

                var focusFaceY = roundFaces.reduce(function(prev, curr) {
                    return (Math.abs(curr - cubeAngle.y) < Math.abs(prev - cubeAngle.y) ? curr : prev);});

                focusInt = setInterval(focusFace, 5, focusFaceX, focusFaceY);
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
        if (!decrementInt && !startInt)
            decrementInt = setInterval(decrementSpeed, 15); 
    }
});

function start() {
    angle.x = 0.18;
    angle.y = -0.21;
    rotateCube();
    setNewAngle();
}

cubeAngle.x = 25;
cubeAngle.y = 25;

startInt = setInterval(start, 15);


*/