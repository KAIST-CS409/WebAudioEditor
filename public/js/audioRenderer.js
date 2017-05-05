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
        <div>
            <div id="waveRow${waveformNum}">
                <div>
                    <input type="file" id="upload${waveformNum}" accept = "audio/*"/> 
                    <button id="play${waveformNum}"> 재생/일시정지 </button>
                    <button id="stop${waveformNum}"> 정지 </button>
                    <button id="download${waveformNum}"> 다운로드 </button>
                </div>
            </div>
            <!--<div id="waveform-timeline${waveformNum}"></div> -->
        </div>
    `

    $("#waveContent").append(newRowtag);
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
        bindGeneralButtons();
    });
    $("#play" + waveformNum).click(function() {
        wsInstance.playPause();
    });

    $("#stop" + waveformNum).click(function() {
        wsInstance.stop();
    });
    $("#download" + waveformNum).click(function() {
        saveToWav(wsInstance.backend.buffer);
    });
    $("#upload" + waveformNum).change(function() {
        wsInstance.loadBlob(this.files[0]);
    });
    return wsInstance
}

function bindGeneralButtons() {
    $("#play").unbind("click");
    $("#play").click(function() {
        for (var i = 0; i < wavesurferList.length; i++) {
            wavesurferList[i].playPause();
        }
    });

    $("#stop").unbind("click");
    $("#stop").click(function() {
        for (var i = 0; i < wavesurferList.length; i++) {
            wavesurferList[i].stop(0);
        }
    });
}
