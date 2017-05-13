import WaveList from 'waveList.js'
    
$(document).ready(function() {
    let waveList = WaveList.create({});

    /* Test codes for dev, should be erased in production*/
    waveList.addWaveForm(0);
    waveList.waveformId++;
    waveList.wavesurfers[0].load("/tracks/Inuyasha_dalmyo.mp3");
    //waveList.wavesurfers[0].destroyPlugin('timeline');
    waveList.addWaveForm(1);
    waveList.waveformId++;
    waveList.wavesurfers[1].load("/tracks/lady_brown.mp3");

    $("#addRow").on("click", function() {
        waveList.add("#waveContent");
    });
});