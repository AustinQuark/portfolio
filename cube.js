var cube = document.getElementById("cube");
var radar = document.getElementById("radar");

let distance = 0;
let rect = radar.getBoundingClientRect();

let x0 = rect.left + rect.width / 2;
let y0 = rect.top + rect.height / 2; 

let vectorX;
let vectorY;
let angle;

radar.addEventListener("mousemove", function(e) {
    vectorX = event.clientX - x0;
    vectorY = event.clientY - y0;
    distance = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
    
    angle = Math.atan2(vectorX, vectorY);
    angle = 180 * angle/Math.PI;
    angle = 180 +  Math.round(angle) % 360;
    console.log(angle);
    console.log(Math.sin(angle) * 10.0);
    cube.style.transform += "rotate3d(" + vectorX + ", " + vectorY + ", 0, " + angle + "deg)";
});