/* Referred http://stackoverflow.com/questions/22560413/html5-web-audio-convert-audio-buffer-into-wav-file */

function saveToWav(buffer) {
  var worker = new Worker('/js/recorderWorker.js');

  // initialize the new worker
  worker.postMessage({
    command: 'init',
    config: {sampleRate: 44100,
              numChannels: buffer.numberOfChannels},
    
  });

  // callback for `exportWAV`
  worker.onmessage = function( e ) {
    var blob = e.data;
    // this is would be your WAV blob

    console.log(blob);
    forceDownload(blob, "new_audio.wav");
  };

  // send the channel data from our buffer to the worker
  var channels = [];

  //Maxiumu number of channels should be 2.
  for (var i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }
  //console.log(channels);
  worker.postMessage({
    command: 'record',
    buffer: channels
  });

  // ask the worker for a WAV
  worker.postMessage({
    command: 'exportWAV',
    type: 'audio/wav'
  });
}

function forceDownload(blob, filename) {
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    let link = window.document.createElement('a');
    link.href = url;
    link.download = filename || 'output.wav';
    link.click();
    (window.URL || window.webkitURL).revokeObjectURL(blob);
}
