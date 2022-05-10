var cube = document.getElementById("cube");

document.documentElement.addEventListener("click", function (e) {
    switch (e.target.id) {
        case "top": cube.style.transform += "rotateX(90deg)";
        case "bot": cube.style.transform -= "rotateX(90deg)";
        case "left": cube.style.transform -= "rotateY(90deg)";
        case "right": cube.style.transform += "rotateY(90deg)";
    }
})