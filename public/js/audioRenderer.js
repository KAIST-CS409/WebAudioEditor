var wavesurferList = [];

$(document).ready(function() {
    wavesurferList.push(getEmptyContainer());
    wavesurferList[0].load("/tracks/Inuyasha_gayagm.mp3");
    wavesurferList.push(getEmptyContainer());
    wavesurferList[1].load("/tracks/electric_romeo.mp3");

    $("#addRow").on("click", addTrackRow)
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
            <div id="waveform-timeline${waveformNum}"></div>
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
        cursorWidth: 2,
        //height: 300,
        //splitChannels: true,
        //scrollParent: true
    });
    wsInstance.on('ready', function () {
        //wsInstance.play();
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: wsInstance,
            container: '#waveform-timeline' + waveformNum
        });

        wsInstance.enableDragSelection({});
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
