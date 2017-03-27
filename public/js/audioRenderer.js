var wavesurfer;

$ (document).ready(function() {
	wavesurfer = WaveSurfer.create({
	    container: '#waveform',
	    waveColor: 'violet',
    	progressColor: 'purple',
    	//barWidth: 2,
    	cursorWidth: 2,
    	//height: 300,
    	splitChannels: true
	});
	//wavesurfer.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');
	wavesurfer.load('/tracks/electric_romeo.mp3');
	wavesurfer.on('ready', function () {
	    wavesurfer.play();
	});

	$("#play").click(function() {
		wavesurfer.playPause();
	});

	$("#stop").click(function() {
		wavesurfer.stop();
	});
	$("#download").click(function() {
		saveToWav(wavesurfer.backend.buffer);
	})
});
