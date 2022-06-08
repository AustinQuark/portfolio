var description = document.getElementsByClassName("description")[0];
var nameplate = document.getElementsByClassName("nameplate-letter");


for (var i = 0; i < nameplate.length; i++) {
    nameplate[i].addEventListener("mouseover", function(e) {
        description.style.transform = "translateY(15px)";
    })
    nameplate[i].addEventListener("mouseout", function (e) {
        description.style.transform = ""
    })
}