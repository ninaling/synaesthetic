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

var applyColorFilter = (function (){

  var sat = 0;

  return function (bassLevel) {
      var style = "";
      var op = 1;

      if (bassLevel > 240) {
        sat++;
        var i = Math.floor(Math.random() * colorFilters.length);
        i = 1;
        
        console.log('running...')

        style += "hue-rotate(" + colorFilters[i].hueRotate + "deg) ";
        style += "saturate(" + sat + ")";

       //var rand = Math.random();

       // style += "invert(100%) ";
       // style += "grayscale(100%) ";
        op = 0;
        
      }
        

      backgroundStars.style.filter = style;
      webGLElement.style.filter = style;

    };

})();


