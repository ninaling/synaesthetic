function youtubeAudio(link, duration){
  this.player = new window.Audio(link);
  this.player.preload = 'metadata';
  this.player.setAttribute("id", "audioPlayer");
  this.player.controls = false;
  document.getElementById('audio-container').appendChild(this.player);

  this.playing = false;

  this.button = document.createElement("img");
  this.button.setAttribute('src', '../assets/play-icon.svg');
  this.button.setAttribute('id', 'play-pause-button');
  this.button.style.width = "35px";
/*
  this.slider = document.createElement("INPUT");
  this.slider.setAttribute("type", "range");
  this.slider.setAttribute("min", "0.1");
  this.slider.setAttribute("max", ".99");
  this.slider.setAttribute("value", "0");
  */

  this.button.addEventListener('click', function(e){
    toggleSong(true, e);

  });
  document.addEventListener('keydown', function(e){
    toggleSong(false, e);
  });

  function toggleSong(isMouseEvent, event) {

    var hasFocus = $('.search-input').is(':focus');
    if((isMouseEvent || event.keyCode == 32) && !hasFocus)
    {
      var player = document.getElementById("audioPlayer");
      if(!player.paused){
        player.pause();
      }
      else{
        player.play();
      }
    }
  };
  //jumps a % into song (e.g. seek(50) jumps to halfway into the song)
  this.seek = function(percent){
    if(this.currentTime() > 95) return;
    var player = document.getElementById("audioPlayer");
    player.currentTime = percent/100 * duration;
  }
  //returns current % into duration of song
  this.currentTime = function(){
    var player = document.getElementById("audioPlayer");
    return (player.currentTime-0.07) / duration;
  }
/*
  this.forward = function(){
    var player = document.getElementById("audioPlayer");
    console.log("b",player.currentTime);
    player.currentTime += 5;
    console.log("a",player.currentTime);
  }
  this.back = function(){
    var player = document.getElementById("audioPlayer");
    console.log("b",player.currentTime);
    player.currentTime -= 5;
    console.log("a",player.currentTime);
  }
*/

  document.getElementById('button-container').appendChild(this.button);

  this.audioCtx = new AudioContext();
  this.audio = document.getElementById('audioPlayer');
  this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);

  this.audio.onpause = function() {
    var button = document.getElementById('play-pause-button');
    button.setAttribute('src', '../assets/play-icon.svg');
  };
  this.audio.onplay = function(){
    var button = document.getElementById('play-pause-button');
    button.setAttribute('src', '../assets/pause-icon.svg');
  };

  this.onEndedCallback = function(){
    this.player.remove();
    this.player = new window.Audio(link);
    this.player.preload = 'metadata';
    this.player.setAttribute("id", "audioPlayer");
    this.player.controls = false;
    document.getElementById('audio-container').appendChild(this.player);

    this.audioCtx = new AudioContext();
    this.audio = document.getElementById('audioPlayer');
    this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);

    this.delay = this.audioCtx.createDelay(5.0);
    this.delay.delayTime.value = 0.07; //adjustable delay! (value is in seconds)

    this.analyser = this.audioCtx.createAnalyser();
    this.audioSrc.connect(this.analyser);
    this.audioSrc.connect(this.delay);
    this.delay.connect(this.audioCtx.destination);

    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    
    this.audio.onpause = function() {
      var button = document.getElementById('play-pause-button');
      button.setAttribute('src', '../assets/play-icon.svg');
    };
    
    this.audio.onplay = function(){
      var button = document.getElementById('play-pause-button');
      button.setAttribute('src', '../assets/pause-icon.svg');
    };
    this.audio.onended = this.onEndedCallback;
  }.bind(this);

  this.audio.onended = this.onEndedCallback;

  this.delay = this.audioCtx.createDelay(5.0);
  this.delay.delayTime.value = 0.07; //adjustable delay! (value is in seconds)

  this.analyser = this.audioCtx.createAnalyser();
  this.audioSrc.connect(this.analyser);
  this.audioSrc.connect(this.delay);
  this.delay.connect(this.audioCtx.destination);

  this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

  this.play = function(){
    this.player.play();
    this.playing = true;
  };

  this.FFT = function(){

    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  };

  this.getCentroid = function() {
    var freqPerBin = this.audioCtx.sampleRate / this.analyser.fftSize;
    var sum = 0, total = 0;
    for(var i = 0; i < this.frequencyData.length; i++){
      sum += freqPerBin*(i+1)*this.frequencyData[i];
      total += this.frequencyData[i];
    }
    return sum/total;
  }

  this.getBass = function(){
    var freqPerBin = this.audioCtx.sampleRate / this.analyser.fftSize;
    var length = 350 / freqPerBin;
    var values = 0;
    var average;
    for(var i = 0; i < length; i++){
      values += this.frequencyData[i];
    }
    average = values / length;
    return average;
  };

  this.getTreble = function(){
    var freqPerBin = this.audioCtx.sampleRate / this.analyser.fftSize;
    var start = Math.floor(3000 / freqPerBin);
    var values = 0;
    var average;
    for(var i = start; i < this.frequencyData.length; i++){
      values += this.frequencyData[i];
    }
    average = values / (this.frequencyData.length - start);
    return average;
  }

  this.getAmplitude = function(){
    var values = 0;
    var average;

    var length = this.frequencyData.length;

    for(var i = 0; i < length; i++){
      values += this.frequencyData[i];
    }

    average = values / length;
    return average;
  };
  /*
  this.isDone = function(){
    if(this.getAmplitude() == 0 && this.getBass() == 0 && this.getCentroid() == NaN)
      alert('hi');
  }
  */
}
