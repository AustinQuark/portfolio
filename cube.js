var cube = document.getElementById("cube");

//Top, Left, Right, Bot
var swapAngles = [[1,0,0], [0, -1, 0], [0, 1, 0], [-1, 0, 0]];
//Front, Back, Top, Bot, Left, Right
var frontAngle = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [-1, 0, 0], [1, 0, 0]];

var currentFace = [0, 0, 1]; //Front

document.documentElement.addEventListener("click", function (e) {
    var swap;
    switch (e.target.id) {
        case 'top': swap = swapAngles[0]; break;
        case 'left': swap = swapAngles[1]; break;
        case 'right': swap = swapAngles[2]; break;
        case 'bot': swap = swapAngles[3]; break;
        default: return;
    }
    cube.style.transform += `rotate3d(${swap[0]}, ${swap[1]}, ${swap[2]}, 90deg)`;

    console.log(swap);
})