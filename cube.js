var cube = document.getElementById("cube");
var radar = document.getElementById("radar");

var radarStatus = false;

radar.addEventListener("mouseenter", function () {radarStatus = true;})
radar.addEventListener("mouseout", function () {radarStatus = false;})

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

function temp () {}

var rotation = document.createElement("rotation")
rotation.type = "text/css"
rotation.innerHTML = ".cssClass { color: #F00; }"

document.addEventListener("mousemove", function(event, radarStatus) {
    if (radar.matches(':hover')) {
      vectorX = event.clientX - x0
      vectorY = event.clientY - y0
      distance = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2))
      if (distance < 300)
      {
        angle = Math.atan2(vectorX, vectorY)
        /*angle = 180 * angle/Math.PI;
          angle = 180 +  Math.round(angle) % 360;*/
        console.log("Angle" + angle)

        cube.style.transform +=
          "rotate3d(" + vectorY + ", " + vectorX + ", 0, " + angle + "deg)"
      }
      setTimeout(temp, 500);
    }
});