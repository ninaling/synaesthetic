// //SOUND PRACTICE
// var song;
// var amp;
// var button;
// var volHistory = [];

// function preload(){
//     song = loadSound('titanicHeart.mp3');
// }

// function setup(){
//     createCanvas(200,200);
//     button = createButton('toggle');
//     button.mousePressed(toggleSong);
//     song.play();
//     amp = new p5.Amplitude();
    
// }

// function draw(){
//     background(0);
//     push();
//     var vol = amp.getLevel();
//     volHistory.push(vol);
//     stroke(255);
//     noFill();
//     var currentY = map(vol, 0, 1, height/2, 0);
//     translate(0, height/2-currentY);
//     beginShape();
//     for(var i = 0; i < volHistory.length; i++){
//         var y = map(volHistory[i], 0, 1, height/2, 0);
//         vertex(i,y);
//     }
//     endShape();
//     pop();
//     if(volHistory.length > width - 50){
//         volHistory.splice(0,1);
//     }
    
//     stroke(255, 0, 0);
//     line(volHistory.length, 0, volHistory.length, height);
    
// //    ellipse(100, 100, 200, vol*200);    
// }

// function toggleSong(){
//     if(song.isPlaying())
//         song.pause();
//     else
//         song.play();
// }

////ADSR PRACTICE
//var wave;
//var playing = false;
//var button;
//var env;
//function setup() {
//    createCanvas(400, 400);
//    
//    env = new p5.Env();
//    env.setADSR(0.05, .25, 0.5, 1);
//    env.setRange(0.8, 0);
//    
//    wave = new p5.Oscillator();
//    slider = createSlider(100, 1200, 440);
//    wave.setType('sine');
//    wave.start();
//    wave.freq(440);
//    wave.amp(env);
//    
//    
//    button = createButton('play/pause');
//    button.mousePressed(toggle);
//}
//
//
//function draw() {
//    wave.freq(slider.value());
//    if(playing){
//        background(255,0,255);
//    } else {
//        background(51);
//    }
//}
//
//function toggle(){
//    env.play();
//}