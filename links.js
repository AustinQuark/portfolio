

document.addEventListener("fileLoaded", function () {
	var links = document.getElementsByClassName("links");
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("mousedown", function () {
            window.open(this.getAttribute("href"));
        });
    }
});