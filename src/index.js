import $ from 'jquery';
import 'dist/css/bootstrap.css';
import 'dist/css/bootstrap-toggle.css';
import 'dist/js/bootstrap.min.js';
import 'dist/js/bootstrap-toggle.min.js';
import 'css/index.css';

import WaveList from 'waveList/waveList.js';
import WaveListModifier from 'waveList/waveListModifier';
import AudioLibrary from './library/audioLibrary';

$(document).ready(function() {
    let waveList = WaveList.create({container: "#waveContent"});
    let waveListModifier = WaveListModifier.create(waveList);

    /* Test codes for dev, should be erased in production*/
    waveList.addWaveForm(0);
    waveList.waveformId++;
    waveList.wavesurfers[0].load("/tracks/Inuyasha_dalmyo.mp3");
    //waveList.wavesurfers[0].destroyPlugin('timeline');
    waveList.addWaveForm(1);
    waveList.waveformId++;
    waveList.wavesurfers[1].load("/tracks/lady_brown.mp3");

    $(".disable-function").click(function(){
        alertWithSnackbar("Please login first");
    });

    let audioLibrary = AudioLibrary.create({});

    $('#libraryModal').on('show.bs.modal', function (event) {
        audioLibrary.requestAudioList(true);
        let button = $(event.relatedTarget); // Button that triggered the modal
        let waveformNum = button.data('index'); // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        let modal = $(this)
        modal.find('.modal-title').data("index", waveformNum);
        //modal.find('.modal-title').text('Upload file to Track' + waveformNum);
    });

    $('#modal-load').click(function() {
        let waveformNum = $('#libraryModal').find('.modal-title').data("index");
        console.log(waveformNum);

        let id = $('input[name=selected-audio]:checked').val();
        console.log(id);
        audioLibrary.requestBlobAndLoad(id, waveList, waveformNum);
    });
});

function alertWithSnackbar(message) {
    // Get the snackbar DIV
    let snackbar = $("#snackbar");
    // Add the "show" class to DIV
    snackbar.text(message);
    snackbar.attr("class", "show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){
        snackbar.text("");
        snackbar.attr("class", "");
    }, 3000);
}