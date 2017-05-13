import WaveSurfer from 'wavesurfer/wavesurfer.js';
import TimelinePlugin from 'wavesurfer/plugin/timeline.js';
import RegionPlugin from 'wavesurfer/plugin/regions.js';
import fileDownloader from 'fileDownloader.js'

export default class WaveList {
    waveformId = 0;
    wavesurfers = [];
    maxTrackLength = 0;

    /* If there is a region in waveformId 1, currentRegionInfo becomes {id: 1, region: regionObject}
     * regionObject.start gives start position, regionObject.end gives end position.
     */
    currentRegionInfo = null; 
    timeline = null;

    constructor(params) {

    };

    static create(params) {
        const waveList = new WaveList(params);
        return waveList.init();
    };

    init() {
        return this;
    };



    add(container) {
        const waveformNum = this.waveformId++;

        this.addEmptyRow(container, waveformNum);
        this.addWaveForm(waveformNum);
    }

    addEmptyRow(container, waveformNum) {
        var newRowtag = `
            <div class="row">
                <div class="col-md-2">
                    <div class="row vertical-align-center">
                        <div class="col-md-4">
                            <span class="track-name"> Track${waveformNum} </span>
                        </div>
                        <div class="col-md-4">
                            <input id="mute${waveformNum}" type="checkbox" checked data-toggle="toggle"
                            data-on="ON" data-off="OFF" data-size="small">
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


        $(container).append(newRowtag);
        $("#mute" + waveformNum).bootstrapToggle();
    }

    addWaveForm(waveformNum) {
        const wsInstance = WaveSurfer.create({
              id: waveformNum,
              container: '#waveRow' + waveformNum,
              waveColor: 'violet',
              progressColor: 'purple',
              cursorWidth: 1,
              plugins: [
              /*
                  TimelinePlugin.create({
                    container: '#waveform-timeline'
                  }),
                  */
                  RegionPlugin.create({
                    dragSelection: true,
                    addFunction: this.addNewRegion.bind(this),
                    color: "rgba(0, 0, 0, 0.5)",
                  })
              ],
              getMaxTrackLengthFunction: this.getMaxTrackLength.bind(this),
              setMaxTrackLengthFunction: this.setMaxTrackLength.bind(this),
              synchronizeProgressFunction: this.synchronizeProgress.bind(this)
          });
        
        this.wavesurfers.push(wsInstance);

        wsInstance.on('ready', function () {

            let length = wsInstance.backend.getDuration();

            let currentTimeLineLength = 0;
            if (this.timeline == null) {
                this.timeline = TimelinePlugin.create({
                    container: "#waveform-timeline",
                    timelineClickFunction: this.moveAndPlayAllByTimeline.bind(this)
                }, wsInstance);
            }
            if (length > this.maxTrackLength) {
                this.maxTrackLength = length;
                this.timeline.render();
            }
            currentTimeLineLength = this.timeline.wavesurfer.backend.getDuration();
            if (wsInstance.backend.getDuration() > currentTimeLineLength) {
                for (var i = 0; i < this.wavesurfers.length; i++) {
                    var targetLength = this.wavesurfers[i].backend.getDuration();
                    if (targetLength != 0) {
                        console.log("redraw!");
                        this.wavesurfers[i].drawer.fireEvent("redraw");
                    }
                }
            }

            wsInstance.setVolume(0.5);

            this.bindGeneralButtons();
        }.bind(this));

        this.bindLocalButtons(waveformNum, wsInstance);
    }

    bindLocalButtons(waveformNum, wsInstance) {
        $("#download" + waveformNum).click(function() {
            fileDownloader.saveToWav(wsInstance.backend.buffer);
        });
        $("#upload" + waveformNum).change(function() {
            wsInstance.loadBlob(this.files[0]);
        });

        $("#volume" + waveformNum).on("input", (function() {
            wsInstance.setVolume(this.value / 100.0);
        }));

        $("#mute" + waveformNum).change(function() {
            wsInstance.toggleMute();
        });
    }

    bindGeneralButtons() {
        $("#play").unbind("click");
        $("#play").click(function() {
            for (var i = 0; i < this.wavesurfers.length; i++) {
                this.wavesurfers[i].play();
            }
            console.log(this.currentRegionInfo);
        }.bind(this));

        $("#pause").unbind("click");
        $("#pause").click(function() {
            for (var i = 0; i < this.wavesurfers.length; i++) {
                this.wavesurfers[i].pause();
            }
        }.bind(this));

        $("#stop").unbind("click");
        $("#stop").click(function() {
            for (var i = 0; i < this.wavesurfers.length; i++) {
                this.wavesurfers[i].stop(0);
            }
        }.bind(this));

        
        $("#mute_on").unbind("click");
        $("#mute_on").click(function() {
            for (var i = 0; i < this.wavesurfers.length; i++) {
                $("#mute" + i).bootstrapToggle('on')
                this.wavesurfers[i].setMute(false);
            }
        }.bind(this));

        $("#mute_off").unbind("click");
        $("#mute_off").click(function() {
            for (var i = 0; i < this.wavesurfers.length; i++) {
                $("#mute" + i).bootstrapToggle('off')
                this.wavesurfers[i].setMute(true);
            }
        }.bind(this));

        $("#trim").unbind("click");
        $("#trim").click(function() {
            if (this.currentRegionInfo != null) {
                console.log(this.wavesurfers[this.currentRegionInfo.id].backend.buffer)
                console.log(this.currentRegionInfo.region.start)
                console.log(this.currentRegionInfo.region.end)

                let selectedRegion = this.currentRegionInfo.region;
                let selectedTrackBuffer = this.wavesurfers[this.currentRegionInfo.id].backend.buffer;

                let startPositionInSec = selectedRegion.start;
                let endPositionInSec = selectedRegion.end;
                let audioLengthInSec = selectedTrackBuffer.duration;

                let audioLengthInBuffer = selectedTrackBuffer.length;
                let startPositionInBuffer = startPositionInSec / audioLengthInSec * audioLengthInBuffer;
                let endPositionInBuffer = endPositionInSec / audioLengthInSec * audioLengthInBuffer;
                
                let blob = fileDownloader.saveToWav(selectedTrackBuffer, 
                    startPositionInBuffer, endPositionInBuffer, true, this.wavesurfers[this.currentRegionInfo.id]);
            }
            else {
                // ERROR: User must specify trim region.
                // Show error message to user.
            }
        }.bind(this));
    }

    addNewRegion(waveformNum, region) {
        if (this.currentRegionInfo != null) {
            this.currentRegionInfo["region"].remove();
        }
        this.currentRegionInfo = {};
        this.currentRegionInfo["id"] = waveformNum;
        this.currentRegionInfo["region"] = region;
    }

    setMaxTrackLength(length) {
        this.maxTrackLength = length;
    }

    getMaxTrackLength() {
        return this.maxTrackLength;
    }

    moveAndPlayAllByTimeline(position) {
        for (var i = 0; i < this.wavesurfers.length; i++) {
            var progress = this.wavesurfers[i].adjustProgress(position);
            //var progress = time / wavesurferList[i].backend.getDuration();
            this.wavesurfers[i].seekTo(progress);
            if (progress < 1) {
                this.wavesurfers[i].play();
            } else {
                this.wavesurfers[i].pause();
            }   
        }
    }

    synchronizeProgress(wsInstance) {
        // Synchronize the movement of wave cursors.
        for (var i = 0; i < this.wavesurfers.length; i++) {
            if (wsInstance == this.wavesurfers[i]) {
                console.log("hi");
                wsInstance.drawer.progress(wsInstance.backend.getPlayedPercents());
                //var progress = time / wavesurferList[i].backend.getDuration();
                //wavesurferList[i].drawer.progress(progress);
            } else {
                this.wavesurfers[i].drawer.updateProgress(wsInstance.drawer.progressWave.offsetWidth);
            }
        }
    }
}