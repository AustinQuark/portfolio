var cube = document.getElementById("cube");
var radar = document.getElementById("radar");

var radarStatus;

radar.addEventListener("mouseenter", function () {radarStatus = true;})
radar.addEventListener("mouseout", function () {radarStatus = false;})

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let distance = 0;
let rect = radar.getBoundingClientRect();

let x0 = rect.left + rect.width / 2;
let y0 = rect.top + rect.height / 2; 

let vectorX;
let vectorY;
let angle;

let dirX = 0;
let dirY = 0;
let dirZ = 1;

radar.addEventListener("mouseenter", function (e) {
    while(radarStatus == false)
    {
        vectorX = e.clientX - x0
        vectorY = e.clientY - y0
        distance = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2))

        angle = Math.atan2(vectorX, vectorY);
        /*angle = 180 * angle/Math.PI;
        angle = 180 +  Math.round(angle) % 360;*/

        console.log(
            "VectorMouse [" +
            Math.round(vectorX) +
            ", " +
            Math.round(vectorY) +
            "] "
        );
        console.log("Angle" + angle);

        cube.style.transform +=
            "rotate3d(" + vectorY + ", " + vectorX + ", 0, " + angle + "deg)";
        sleep(500);
    }
});