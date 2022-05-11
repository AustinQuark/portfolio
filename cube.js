var cube = document.getElementById("cube");

var currentFace = [0, 0, 1]; //Front

//Front, Back, Top, Bot, Left, Right
var strFrontAngle = ["Front", "Back", "Top", "Bot", "Left", "Right"];
var frontAngle = [[0, 0, 1], [0, 0, -1], [0, -1, 0], [0, 1, 0], [-1, 0, 0], [1, 0, 0]];

function swapTop(currentFace) {
    var newCurrentFace = [currentFace[0], -currentFace[2], currentFace[1]];
    return newCurrentFace;
}

function swapLeft(currentFace) {
    var newCurrentFace = [-currentFace[2], currentFace[1], currentFace[0]];
    return newCurrentFace
}

function swapBot(currentFace) {
    var newCurrentFace = [currentFace[0], currentFace[2], -currentFace[1]];
    return newCurrentFace
}

function swapRight(currentFace) {
  var newCurrentFace = [currentFace[2], currentFace[1], -currentFace[0]];
  return newCurrentFace
}

function arrayEquals(a, b) {
  return Array.isArray(a) && Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
}

document.documentElement.addEventListener("click", function (e) {
    var swap;
    var strSwap;
    switch (e.target.id) {
        case 'top': swap = swapTop; break;
        case 'left': swap = swapLeft; break;
        case 'right': swap = swapRight; break;
        case 'bot': swap = swapBot; break;
        default: return;
    }

    currentFace = swap(currentFace);
    for (var i = 0; i < frontAngle.length; i++)
    {
        if (arrayEquals(currentFace, frontAngle[i]))
        {
            strSwap = strFrontAngle[i];
            break;
        }
    }

    console.log(strFrontAngle[i], strSwap);
    console.log("show" + strSwap)
        
    cube.removeAttribute("class")
    cube.classList.add("cube")
    cube.classList.toggle("show" + strSwap);
    console.log(cube.classList);

})