var wavesurfer;

$(document).ready(function() {
	wavesurfer = WaveSurfer.create({
	    container: '#waveform',
	    waveColor: 'violet',
    	progressColor: 'purple',
    	//barWidth: 2,
    	cursorWidth: 2,
    	//height: 300,
    	//splitChannels: true,
        //scrollParent: true
	});
    wavesurfer.load('/tracks/Inuyasha_gayagm.mp3');
	wavesurfer.on('ready', function () {
	    wavesurfer.play();
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: wavesurfer,
            container: '#waveform-timeline'
        });

        wavesurfer.enableDragSelection({});
	});

	$("#play").click(function() {
		wavesurfer.playPause();
	});

	$("#stop").click(function() {
		wavesurfer.stop();
	});
	$("#download").click(function() {
		saveToWav(wavesurfer.backend.buffer);
	});
    $("#upload").change(function() {
        wavesurfer.loadBlob(this.files[0]);
    });
});
