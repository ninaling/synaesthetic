var colorFilters = [80, 20, 40, 340]; //hueRotate values

var allContent = document.getElementById("graphics");
var backgroundStars = document.getElementById("background-stars");
var webGLElement = document.getElementById("webgl");

function applyColorFilterInvert(bassLevel, invert) {
  if (bassLevel > 240) {
    if (invert < 2) {
      var filterStyle = "invert(1) hue-rotate(10deg)";
      allContent.style.filter = filterStyle;
      allContent.style.webkitFilter = filterStyle;
    }
    else if (invert == 2) {
      var filterStyle = "invert(1) grayscale(1)";
      allContent.style.filter = filterStyle;
      allContent.style.webkitFilter = filterStyle;
    }
  }
}

function disableColorFilterInvert(){
  var filterStyle = "invert(0) hue-rotate(0deg) grayscale(0)";
  allContent.style.filter = filterStyle;
  allContent.style.webkitFilter = filterStyle;
}

var applyColorFilterBackground = (function (){
  var sat = 0;
  return function (bassLevel, invert) {
      var style = "";
      if (bassLevel > 240) {
        sat += 2;
        if(sat > 7)
            sat = 1;
        var i = Math.floor(Math.random() * colorFilters.length);

        style += "hue-rotate(" + colorFilters[i] + "deg) ";
        if (invert < 2) {
          style += "invert(1) hue-rotate(10deg) ";
        }
        else if (invert == 2) {
          style += "invert(1) grayscale(1) ";
        }
        style += "saturate(" + sat + ")";

        backgroundStars.style.filter = style;
        backgroundStars.style.webkitFilter = style;
        return true;
      }
      backgroundStars.style.filter = style;
      backgroundStars.style.webkitFilter = style;
      return false;
    };
})();

var applyColorFilterStars = (function (){
  var sat = 0;
  return function (bassLevel, invert) {
    var style = "";

    if (bassLevel > 240) {
      sat++;
      if(sat > 6)
          sat = 1;
      var i = Math.floor(Math.random() * colorFilters.length);

      style += "hue-rotate(" + colorFilters[i] + "deg) ";
      if (invert < 2) {
        style += "invert(1) hue-rotate(10deg) ";
      }
      else if (invert == 2) {
        style += "invert(1) grayscale(1) ";
      }
      style += "saturate(" + sat + ")";
      webGLElement.style.filter = style;
      webGLElement.style.webkitFilter = style;
      return true;
    }
    webGLElement.style.filter = style;
    webGLElement.style.webkitFilter = style;
    return false;
  };
})();
