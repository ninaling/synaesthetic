function youtubeAudio(link){
  this.player = new window.Audio(link);
  this.player.preload = 'metadata';
  this.player.setAttribute("id", "audioPlayer");
  this.player.controls = true;
  document.body.appendChild(this.player);

  this.audioCtx = new AudioContext();
  this.audio = document.getElementById('audioPlayer');
  this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);

  this.analyser = this.audioCtx.createAnalyser();
  //this.analyser.fftSize = 32768/2;
  this.audioSrc.connect(this.analyser);
  this.audioSrc.connect(this.audioCtx.destination);

  this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

  this.play = function(){
    this.player.play();
  }

  this.FFT = function(){
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }
}