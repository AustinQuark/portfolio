var cube = document.getElementById("cube");
var radar = document.getElementById("radar");

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
var r = document.querySelector(":root");
function temp () {};


const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

document.addEventListener("mousemove", async function(event, radarStatus) {
      vectorX = event.clientX - x0
      vectorY = event.clientY - y0
      distance = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
      if (distance < 150)
      {
        angle = Math.atan2(vectorX, vectorY)
        /*angle = 180 * angle/Math.PI;
          angle = 180 +  Math.round(angle) % 360;*/

        r.style.setProperty('--vectorX', `${vectorX}`, "important");
        r.style.setProperty('--vectorX', `${vectorX}`, "important");
        r.style.setProperty('--angle', `${angle * 10}rad`, "important");
      };
});