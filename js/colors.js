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

var applyColorFilterBackground = (function (){
  var sat = 0;
  return function (bassLevel) {
      var style = "";
      if (bassLevel > 240) {
        console.log("sat = " + sat);
        sat+=3;
        if(sat > 12)
            sat = 0;
        var i = Math.floor(Math.random() * colorFilters.length);
        console.log("i = " + i);
        

        style += "hue-rotate(" + colorFilters[i].hueRotate + "deg) ";
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
        console.log("i = " + i); 

        style += "hue-rotate(" + colorFilters[i].hueRotate + "deg) ";
        style += "saturate(" + sat + ")";
        webGLElement.style.filter = style;
        return true;
      }
      webGLElement.style.filter = style;
      return false;  
 };


})();


/*
function applyColorFilter(bassLevel) {
  if (bassLevel > 230) {
    var i = Math.floor(Math.random() * colorFilters.length);
    var colorStyle = "hue-rotate(" + colorFilters[i].hueRotate + "deg) saturate(" + colorFilters[i].saturate + ")";

    backgroundStars.style.filter = colorStyle;
    webGLElement.style.filter = colorStyle;
  }

}
*/

//var rand = Math.random();

// style += "invert(100%) ";
// style += "grayscale(100%) ";

