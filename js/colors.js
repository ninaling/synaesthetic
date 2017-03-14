var colorFilters = [110, 20, 300]; //hueRotate values

var allContent = document.getElementById("graphics");
var backgroundStars = document.getElementById("background-stars");
var webGLElement = document.getElementById("webgl");

function applyColorFilterInvert(bassLevel, invert) {
  if (bassLevel > 240 && invert == 0) {
    allContent.style.filter = "invert(1)";
  }
}

function disableColorFilterInvert(){
  allContent.style.filter = "invert(0)";
}

var applyColorFilterBackground = (function (){
  var sat = 0;
  return function (bassLevel) {
      var style = "";
      if (bassLevel > 240) {
        sat += 3;
        if(sat > 12)
            sat = 0;
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
      if(sat > 10)
          sat = 0;
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
