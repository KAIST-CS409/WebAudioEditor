import AudioLibrary from '../library/audioLibrary';

/* Referred http://stackoverflow.com/questions/22560413/html5-web-audio-convert-audio-buffer-into-wav-file */
export default class FileDownloader {
    constructor() {
    }
    static saveToWav(buffer, isSave=false) {
        var worker = new Worker('/js/recorderWorker.js');

        // initialize the new worker
        worker.postMessage({
            command: 'init',
            config: {sampleRate: 44100,  numChannels: buffer.numberOfChannels},
        });

        // callback for `exportWAV`
        worker.onmessage = function( e ) {
            var blob = e.data;
            // this is would be your WAV blob

            console.log(isSave);
            if (isSave) {
                AudioLibrary.requestSave(blob, "new_audio.wav");
            } else {
                FileDownloader.forceDownload(blob, "new_audio.wav");
            }
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
  static forceDownload(blob, filename) {
    let url = (window.URL || window.webkitURL).createObjectURL(blob);
    let link = window.document.createElement('a');
    link.href = url;
    link.download = filename || 'output.wav';
    link.click();
    (window.URL || window.webkitURL).revokeObjectURL(blob);
  }
}
