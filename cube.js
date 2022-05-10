var cube = document.getElementsByClassName("cube")[0];

(function () {
  document.onmousemove = handleMouseMove
  function handleMouseMove(event) {
    var eventDoc, doc, body

    event = event || window.event // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
      eventDoc = (event.target && event.target.ownerDocument) || document
      doc = eventDoc.documentElement
      body = eventDoc.body

      event.pageX =
        event.clientX +
        ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
        ((doc && doc.clientLeft) || (body && body.clientLeft) || 0)
      event.pageY =
        event.clientY +
        ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
        ((doc && doc.clientTop) || (body && body.clientTop) || 0)
    }

    // Use event.pageX / event.pageY here
    var x = event.pageX
    var y = event.pageY;
    var angle = Math.atan(y / x);
    var len = Math.sqrt(pow(x, 2) + pow(y, 2));

    var coords = [x / len, y / len];
    cube.style.animation = 
  }
})()