import $ from 'jquery';
import 'dist/css/bootstrap.css';
import 'dist/css/bootstrap-toggle.css';
import 'dist/js/bootstrap.min.js';
import 'dist/js/bootstrap-toggle.min.js';
import 'css/index.css';





import WaveList from 'waveList/waveList.js';
import WaveListModifier from 'waveList/waveListModifier';



$(document).ready(function() {
    let waveList = WaveList.create({});
    let waveListModifier = WaveListModifier.create(waveList);

    /* Test codes for dev, should be erased in production*/
    waveList.addWaveForm(0);
    waveList.waveformId++;
    waveList.wavesurfers[0].load("/tracks/Inuyasha_dalmyo.mp3");
    //waveList.wavesurfers[0].destroyPlugin('timeline');
    waveList.addWaveForm(1);
    waveList.waveformId++;
    waveList.wavesurfers[1].load("/tracks/lady_brown.mp3");
});