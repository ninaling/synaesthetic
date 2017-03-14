var colorFilters = [80, 20, 40, 340]; //hueRotate values

var allContent = document.getElementById("graphics");
var backgroundStars = document.getElementById("background-stars");
var webGLElement = document.getElementById("webgl");

function applyColorFilterInvert(bassLevel, invert) {
  if (bassLevel > 240) {
    if (invert < 2) {
      allContent.style.filter = "invert(1) saturate(100deg)";
    }
    else if (invert == 2) {
      allContent.style.filter = "invert(1) grayscale(1)";
    }
  }
}

function disableColorFilterInvert(){
  allContent.style.filter = "invert(0) hue-rotate(0deg) grayscale(0)";
}

var applyColorFilterBackground = (function (){
  var sat = 0;
  return function (bassLevel) {
      var style = "";
      if (bassLevel > 240) {
        sat += 2;
        if(sat > 7)
            sat = 1;
        var i = Math.floor(Math.random() * colorFilters.length);

        style += "hue-rotate(" + colorFilters[i] + "deg) ";
        style += "saturate(" + sat + ")";

        backgroundStars.style.filter = style;
        return true;
      }
      backgroundStars.style.filter = style;
      return false;
    };
})();

var applyColorFilterStars = (function (){
  var sat = 0;
  return function (bassLevel) {
    var style = "";

    if (bassLevel > 240) {
      sat++;
      if(sat > 6)
          sat = 1;
      var i = Math.floor(Math.random() * colorFilters.length);

      style += "hue-rotate(" + colorFilters[i] + "deg) ";
      style += "saturate(" + sat + ")";
      webGLElement.style.filter = style;
      return true;
    }
    webGLElement.style.filter = style;
    return false;
  };
})();
