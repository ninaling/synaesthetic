// python -m SimpleHTTPServer

var mic, fft;
var recNum = 10;
var stdNum = 10;
var j = 0;
var recVal = [];
var stdVal = [];
var sum, avgStd, stdev;
// BEAT DETECTION
var cnv, soundFile, peakDetect;
var ellipseWidth = 10;

function preload() {
    hapax = loadSound('assets/hapax.mp3');
}

function StandardDeviation(numbersArr) {
    //--CALCULATE AVAREGE--
    var total = 0;
    for(var key in numbersArr)
       total += numbersArr[key];
    var meanVal = total / numbersArr.length;
    //--CALCULATE AVAREGE--

    //--CALCULATE STANDARD DEVIATION--
    var SDprep = 0;
    for(var key in numbersArr)
       SDprep += Math.pow((parseFloat(numbersArr[key]) - meanVal),2);
    var SDresult = Math.sqrt(SDprep/numbersArr.length);
    //--CALCULATE STANDARD DEVIATION--
    // alert(SDresult);
    return SDresult;
}

function setup() {
   createCanvas(710,400);
   noFill();


// MIC INPUT
   // mic = new p5.AudioIn();
   // mic.start();
   // fft = new p5.FFT();
   // fft.setInput(mic);
   // peakDetect = new p5.PeakDetect();

// LOAD SONG
    soundFile = hapax;
    // soundFile.play(); //comment out if want mouse-clicking play
    fft = new p5.FFT();
    peakDetect = new p5.PeakDetect();
}

function draw() {
   background(200);
   var spectrum = fft.analyze();


// BEAT DETECTION
     peakDetect.update(fft);
     console.log(peakDetect.isDetected);

     if ( peakDetect.isDetected ) {
         //stars effect
       ellipseWidth = 50;
     } else {
       ellipseWidth *= 0.95;
     }
   //
     ellipse(width/2, height/2, ellipseWidth, ellipseWidth);


// FREQUENCY VISUALIZATION
   beginShape();
   for (i = 0; i<spectrum.length; i++) {
    var freqVal = map(spectrum[i], 0, 255, height, 0);
    vertex(i, freqVal);
    recVal[i] = freqVal;
   }
   // stdev = StandardDeviation(recVal);
   if (j < stdNum)
   {
       stdVal[j] = StandardDeviation(recVal);
       j++
   }
   if (j === stdNum)
   {
       avgStd = stdVal.reduce(function(sum, a) { return sum + a },0)/(stdVal.length||1);
    //    console.log("avg: " + avgStd);
       j = 0;
   }

   endShape();
}



// function setup() {
//   background(0);
//   noStroke();
//   fill(255);
//   textAlign(CENTER);
//
//   soundFile = hapax;
//
//   // p5.PeakDetect requires a p5.FFT
//   fft = new p5.FFT();
//   peakDetect = new p5.PeakDetect();
//
// }
//
// function draw() {
//   background(0);
//   text('click to play/pause', width/2, height/2);
//
//   // peakDetect accepts an fft post-analysis
//   fft.analyze();
//   peakDetect.update(fft);
//   // console.log(peakDetect.isDetected);
//
//
//   if ( peakDetect.isDetected ) {
//       //stars effect
//     ellipseWidth = 50;
//   } else {
//     ellipseWidth *= 0.95;
//   }
//
//   ellipse(width/2, height/2, ellipseWidth, ellipseWidth);
// }
//
// // toggle play/stop when canvas is clicked
function mouseClicked() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (soundFile.isPlaying() ) {
      soundFile.stop();
    } else {
      soundFile.play();
    }
  }
}
