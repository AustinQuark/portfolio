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

var speedInvert = 50;
var root = document.querySelector(":root");
var clock = false;

var a = 0;

function rotateCube() {
    a += angle.x * 10;
    a %= 360;

	/*angle = 180 * angle/Math.PI;
						angle = 180 +  Math.round(angle) % 360;*/
	root.style.setProperty("--angleX", `${a}deg`, "important");
	root.style.setProperty("--angleY", `${angle.x}deg`, "important");
}

function decrementSpeed() {
    if (Math.abs(angle.x) > 0 || Math.abs(angle.y) > 0)
    {
        angle.x -= Math.sign(angle.x) * 0.05; 
        angle.y -= Math.sign(angle.y) * 0.05;
        rotateCube();
        return ;
    }
    clearInterval(clock);
    clock = false;
}

document.addEventListener("mousemove", function(e) { 
    mouse.x = e.clientX - radar.x;
    mouse.y = e.clientY - radar.y;

    distance = Math.sqrt(Math.pow(mouse.x, 2) + Math.pow(mouse.y, 2));
	angle.x = mouse.x / distance;
    angle.y = mouse.y / distance;
    console.log(angle.x, angle.y);

    if (distance <= radar.shape.width / 2)
    {
        if (!clock)
            clock = setInterval(rotateCube, 15);
        radar.on = true;
    }
    else
    {
        radar.on = false;
        clearInterval(clock);
        clock = false;
        //clock = setInterval(decrementSpeed, 15);
        
    }

});