var cube = document.getElementById("cube");
var radar = document.getElementById("radar");

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))


let distance = 0;
let rect = radar.getBoundingClientRect();

let x0 = rect.left + rect.width / 2;
let y0 = rect.top + rect.height / 2; 

let vectorX;
let vectorY;
let angle;

let dirX = 1;
let dirY = 1;
let dirZ = 1;
var root = document.querySelector(":root");

document.addEventListener("mousemove", async function(event, radarStatus) {
      vectorX = event.clientX - x0
      vectorY = event.clientY - y0
      distance = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
      if (distance < 150)
      {
        angle = Math.atan2(vectorX, vectorY)
        /*angle = 180 * angle/Math.PI;
          angle = 180 +  Math.round(angle) % 360;*/

        root.style.setProperty('--vectorX', `${vectorX}`, "important");
        root.style.setProperty('--vectorX', `${vectorX}`, "important");
        root.style.setProperty('--angle', `${angle * 10}rad`, "important");
      };
});