function youtubeAudio(link){
  this.player = new window.Audio(link);
  this.player.preload = 'metadata';
  this.player.setAttribute("id", "audioPlayer");
  this.player.controls = true;
   document.getElementById('audio-container').appendChild(this.player);

  this.audioCtx = new AudioContext();
  this.audio = document.getElementById('audioPlayer');
  this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);

  //create delays
  this.delayToOutput = this.audioCtx.createDelay(5.0);
  this.delayToOutput.delayTime.value = 0.5; //adjustable delay! (value is in seconds)

  this.delayToAnalyser = this.audioCtx.createDelay(5.0);
  this.delayToAnalyser.delayTime.value = 0.4;

  this.delayAhead = this.audioCtx.createDelay(5.0);
  this.delayAhead.delayTime.value = 0.6;

  this.delayBehind = this.audioCtx.createDelay(5.0);
  this.delayBehind.delayTime.value = 0.2;
  
  //create analyzers
  this.analyser = this.audioCtx.createAnalyser();
  this.analyserAhead = this.audioCtx.createAnalyser();
  this.analyserBehind = this.audioCtx.createAnalyser();

  //connect audioSrc to delays
  this.audioSrc.connect(this.delayToOutput);
  this.audioSrc.connect(this.delayToAnalyser);
  this.audioSrc.connect(this.delayAhead);
  this.audioSrc.connect(this.delayBehind);

  //connect delays to analyzers
  this.delayToAnalyser.connect(this.analyser);
  this.delayAhead.connect(this.analyserAhead);
  this.delayBehind.connect(this.analyserBehind);

  //connect output
  this.delayToOutput.connect(this.audioCtx.destination);

  this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
  this.aheadFrequencyData = new Uint8Array(this.analyserAhead.frequencyBinCount);
  this.behindFrequencyData = new Uint8Array(this.analyserBehind.frequencyBinCount);

  //vars for peak detection
  this.behindTenBass = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.aheadTenBass =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.bassIndex = 0;
  this.bassLevel = 0;

  this.play = function(){
    this.player.play();
  };

  this.FFT = function(){
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyserAhead.getByteFrequencyData(this.aheadFrequencyData);
    this.analyserBehind.getByteFrequencyData(this.behindFrequencyData);
    this.update()
    return this.frequencyData;
  };

  this.update = function(){
    //get current bass
    var freqPerBin = this.audioCtx.sampleRate / this.analyser.fftSize;
    var length = 350 / freqPerBin;
    var values = 0;
    var average;
    for(var i = 0; i < length; i++){
      values += this.frequencyData[i];
    }
    average = values/length;
    this.bassLevel = average;

    //get ahead bass
    freqPerBin = this.audioCtx.sampleRate / this.analyserAhead.fftSize;
    length = 350 / freqPerBin;
    values = 0;
    for(var i = 0; i < length; i++){
      values += this.aheadFrequencyData[i];
    }
    average = values/length;
    this.aheadTenBass[this.bassIndex] = average;
    
    //get behind bass
    freqPerBin = this.audioCtx.sampleRate / this.analyserBehind.fftSize;
    length = 350 / freqPerBin;
    values = 0;
    for(var i = 0; i < length; i++){
      values += this.behindFrequencyData[i];
    }
    average = values/length;
    this.behindTenBass[this.bassIndex] = average;

    this.bassIndex = (this.bassIndex + 1) % 30;
  }

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

  this.detectBassPeak = function(){
    if(this.bassLevel == 0){
      return false;
    }
    var behindMax = Math.max(...this.behindTenBass);
    var aheadMax = Math.max(...this.aheadTenBass);
    return (this.bassLevel == Math.max(this.bassLevel, behindMax, aheadMax));
  }
}
