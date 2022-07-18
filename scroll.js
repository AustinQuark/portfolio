//source : https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
	e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
	if (keys[e.keyCode]) {
		preventDefault(e);
		return false;
	}
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
	window.addEventListener(
		"test",
		null,
		Object.defineProperty({}, "passive", {
			get: function () {
				supportsPassive = true;
			},
		})
	);
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

function disableScroll() {
	window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
	window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
	window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
	window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

function enableScroll() {
	window.removeEventListener("DOMMouseScroll", preventDefault, false);
	window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
	window.removeEventListener("touchmove", preventDefault, wheelOpt);
	window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

var square = document.getElementById("square");

var isInViewport = function (elem) {
	var bounding = elem.getBoundingClientRect();
	return (
		bounding.top >= 0 &&
		bounding.left >= 0 &&
		bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
};

cube_container.addEventListener("touchstart", function(e) {
    disableScroll();
});

cube_container.addEventListener("touchend", function (e) {
	enableScroll();
});

document.addEventListener("resize", function(e) {
if (square.offsetHeight < window.innerHeight)
	disableScroll();
else
    enableScroll();
})
