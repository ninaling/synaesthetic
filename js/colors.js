var colorFilters = [
  {
    hueRotate: 110,
    saturate: 7
  },
  {
    hueRotate: 20,
    saturate: 6
  },
  {
    hueRotate: 300,
    saturate: 8
  }
];

var backgroundStars = document.getElementById("background-stars");
var webGLElement = document.getElementById("webgl");

function applyColorFilter(bassLevel) {
  if (bassLevel > 230) {
    var i = Math.floor(Math.random() * colorFilters.length);
    var colorStyle = "hue-rotate(" + colorFilters[i].hueRotate + "deg) saturate(" + colorFilters[i].saturate + ")";

    backgroundStars.style.filter = colorStyle;
    webGLElement.style.filter = colorStyle;
  }
  else {
    var colorStyle = "hue-rotate(0deg) saturate(1)";
    backgroundStars.style.filter = colorStyle;
    webGLElement.style.filter = colorStyle;
  }
}
