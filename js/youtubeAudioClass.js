function youtubeAudio(link){
  this.player = new window.Audio(link);
  this.player.preload = 'metadata';
  this.player.setAttribute("id", "audioPlayer");
  this.player.controls = true;
   document.getElementById('audio-container').appendChild(this.player);

  this.audioCtx = new AudioContext();
  this.audio = document.getElementById('audioPlayer');
  this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);
  this.analyser = this.audioCtx.createAnalyser();
  this.analyser.fftSize = 4096; //remove later
  this.audioSrc.connect(this.analyser);
  this.audioSrc.connect(this.audioCtx.destination);

  this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

  this.play = function(){
    this.player.play();
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
    average = values/length;
    return average;
  };

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
}
