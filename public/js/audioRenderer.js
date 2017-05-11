var wavesurferList = [];
var maxTrackLength = 0;
var globalTimeline = null;
var globalRegion = null;

$(document).ready(function() {
    wavesurferList.push(getEmptyContainer());
    wavesurferList[0].load("/tracks/Inuyasha_dalmyo.mp3");
    wavesurferList.push(getEmptyContainer());
    wavesurferList[1].load("/tracks/lady_brown.mp3");

    $("#addRow").on("click", addTrackRow);
});

function addTrackRow() {
    var waveformNum = wavesurferList.length;
    var newRowtag = `
        <div class="row">
            <div class="col-md-2">
                <div class="row vertical-align-center">
                    <div class="col-md-4">
                        <span class="track-name"> Track${waveformNum} </span>
                    </div>
                    <div class="col-md-4">
                        <input id="mute${waveformNum}" type="checkbox" checked data-toggle="toggle" data-size="small">
                    </div>
                </div>
                <div class="row vertical-align-center">
                    <div class="col-md-2">
                        <span class="glyphicon glyphicon-volume-up"></span>
                    </div>
                    <div class="col-md-10">
                        <input type="range" id="volume${waveformNum}" min="0" max="100" value="50"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <input type="file" id="upload${waveformNum}" accept = "audio/*"/> 
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <button id="download${waveformNum}" class="btn btn-sm btn-default"> 다운로드 </button>
                    </div>
                </div> 
            </div>
            <div class="col-md-10">
                <div id="waveRow${waveformNum}">
                </div>
            </div>
        </div>
    `


    $("#waveContent").append(newRowtag);
    $("#mute" + waveformNum).bootstrapToggle();
    wavesurferList.push(getEmptyContainer());
}

function getEmptyContainer() {
    var waveformNum = wavesurferList.length;
    var wsInstance = WaveSurfer.create({
        container: "#waveRow" + waveformNum,
        waveColor: 'violet',
        progressColor: 'purple',
        //barWidth: 2,
        cursorWidth: 1,
        //height: 300,
        //splitChannels: true,
        //scrollParent: true
    });
    wsInstance.on('ready', function () {
        //wsInstance.play();

        wsInstance.enableDragSelection({
            color: "rgba(0, 0, 0, 0.5)",
        });

        var length = wsInstance.backend.getDuration();
        var currentTimeLineLength = 0;
        if (globalTimeline != null) {
            currentTimeLineLength = globalTimeline.wavesurfer.backend.getDuration();
        }
        if (wsInstance.backend.getDuration() > currentTimeLineLength) {
            globalTimeline = Object.create(WaveSurfer.Timeline);
            globalTimeline.init({
                wavesurfer: wsInstance,
                container: '#waveform-timeline'
            });

            for (var i = 0; i < wavesurferList.length; i++) {
                var targetLength = wavesurferList[i].backend.getDuration();
                if (targetLength != 0 && (targetLength < maxTrackLength) ) {
                    wavesurferList[i].drawer.fireEvent("redraw");
                }
            }
        }

        wsInstance.setVolume(0.5);

        bindGeneralButtons();
    });
    /*
    $("#play" + waveformNum).click(function() {
        wsInstance.playPause();
    });

    $("#stop" + waveformNum).click(function() {
        wsInstance.stop();
    });
    */
    $("#download" + waveformNum).click(function() {
        saveToWav(wsInstance.backend.buffer);
    });
    $("#upload" + waveformNum).change(function() {
        wsInstance.loadBlob(this.files[0]);
    });

    $("#volume" + waveformNum).on("input", (function() {
        wsInstance.setVolume(this.value / 100.0);
    }));

    /*
    $("#mute" + waveformNum).click(function() {
        wsInstance.toggleMute();
    });
    */

    $("#mute" + waveformNum).change(function() {
        wsInstance.toggleMute();
    });

    // Fade in and Fade out has four modes, but in this project, only use linear.
    // Four modes = SCURVE, LINEAR, EXPONENTIAL, LOGARITHMIC
    // Reference : naomiaro/fade-maker
    // Link : https://github.com/naomiaro/fade-maker
    $("#fadein" + waveformNum).click(function() {
        // To cover unselected case
        var s = 0;
        var e = wsInstance.getDuration();
        // Getting range [s ~ e]
        var a = wsInstance.regions.list;
        var key = Object.keys(a);
        for (i = 0; i < key.length; i++) {
            s = a[key[i]].start;
            e = a[key[i]].end;
        }
        // Fade in part
        var sr = wsInstance.backend.buffer.sampleRate;
        var ch = wsInstance.backend.buffer.numberOfChannels;
        var ssr = parseInt(s * sr);
        var esr = parseInt(e * sr);
        var lsr = esr - ssr;
        for (var i = 0; i < ch; i++){
            var buf = wsInstance.backend.buffer.getChannelData(i);
            for (var t = ssr; t < esr; t++){
                buf[t] *= (t - ssr) / lsr;
            }
        }
        wsInstance.drawer.fireEvent("redraw");
    });
    $("#fadeout" + waveformNum).click(function() {
        // To cover unselected case
        var s = 0;
        var e = wsInstance.getDuration();
        // Getting range [s ~ e]
        var a = wsInstance.regions.list;
        var key = Object.keys(a);
        for (i = 0; i < key.length; i++) {
            s = a[key[i]].start;
            e = a[key[i]].end;
        }
        // Fade in part
        var sr = wsInstance.backend.buffer.sampleRate;
        var ch = wsInstance.backend.buffer.numberOfChannels;
        var ssr = parseInt(s * sr);
        var esr = parseInt(e * sr);
        var lsr = esr - ssr;
        for (var i = 0; i < ch; i++){
            var buf = wsInstance.backend.buffer.getChannelData(i);
            for (var t = ssr; t < esr; t++){
                buf[t] *= (esr - t) / lsr;
            }
        }
        wsInstance.drawer.fireEvent("redraw");
    });
    $("#reverse" + waveformNum).click(function() {
        window.alert("Reverse clicked");
        // TODO : FADE-IN
    });

    return wsInstance
}

function bindGeneralButtons() {
    $("#play").unbind("click");
    $("#play").click(function() {
        for (var i = 0; i < wavesurferList.length; i++) {
            wavesurferList[i].play();
        }
    });

    $("#pause").unbind("click");
    $("#pause").click(function() {
        for (var i = 0; i < wavesurferList.length; i++) {
            wavesurferList[i].pause();
        }
    });

    $("#stop").unbind("click");
    $("#stop").click(function() {
        for (var i = 0; i < wavesurferList.length; i++) {
            wavesurferList[i].stop(0);
        }
    });

    
    $("#mute_on").unbind("click");
    $("#mute_on").click(function() {
        for (var i = 0; i < wavesurferList.length; i++) {
            $("#mute" + i).bootstrapToggle('on')
            wavesurferList[i].setMute(false);
        }
    });

    $("#mute_off").unbind("click");
    $("#mute_off").click(function() {
        for (var i = 0; i < wavesurferList.length; i++) {
            $("#mute" + i).bootstrapToggle('off')
            wavesurferList[i].setMute(true);
        }
    });
}
