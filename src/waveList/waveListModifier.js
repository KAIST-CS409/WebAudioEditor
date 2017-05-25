import FilterPlugin from '../filter/filter.js';
import TrimFilter from '../filter/trim.js';
import FadeInFilter from '../filter/fadeIn.js';
import FadeOutFilter from '../filter/fadeOut.js';
import PitchFilter from '../filter/pitch.js';
import ReverseFilter from '../filter/reverse.js';
import VolumeFilter from '../filter/volume.js';
import Mixer from './mixer';

export default class WaveListModifier {
    constructor(waveList) {
        this.waveList = waveList;
        FilterPlugin.alertWithSnackbar = waveList.alertWithSnackbar;
    }

    static create(waveList) {
        const waveListModifier = new WaveListModifier(waveList);
        return waveListModifier.init();
    }

    init() {
        this.bindGeneralButtons();
        return this;
    }

    bindGeneralButtons() {
        $("#play").unbind("click");
        $("#play").click(function() {
            for (var i = 0; i < this.waveList.wavesurfers.length; i++) {
                this.waveList.wavesurfers[i].play();
            }
        }.bind(this));

        $("#pause").unbind("click");
        $("#pause").click(function() {
            for (var i = 0; i < this.waveList.wavesurfers.length; i++) {
                this.waveList.wavesurfers[i].pause();
            }
        }.bind(this));

        $("#stop").unbind("click");
        $("#stop").click(function() {
            for (var i = 0; i < this.waveList.wavesurfers.length; i++) {
                this.waveList.wavesurfers[i].stop();
            }
        }.bind(this));


        $("#mute_on").unbind("click");
        $("#mute_on").click(function() {
            for (var i = 0; i < this.waveList.wavesurfers.length; i++) {
                $("#mute" + i).bootstrapToggle('on')
                this.waveList.wavesurfers[i].setMute(false);
            }
        }.bind(this));

        $("#mute_off").unbind("click");
        $("#mute_off").click(function() {
            for (var i = 0; i < this.waveList.wavesurfers.length; i++) {
                $("#mute" + i).bootstrapToggle('off')
                this.waveList.wavesurfers[i].setMute(true);
            }
        }.bind(this));

        $("#zoom_in").unbind("click");
        $("#zoom_in").click(function() {
            let currentMaxLength = 0;
            for (var i = 0; i < this.waveList.wavesurfers.length; i++) {
                let instanceLength = this.waveList.wavesurfers[i].backend.getDuration();
                if (instanceLength > currentMaxLength) {
                    currentMaxLength = instanceLength;
                }
            }

            if (currentMaxLength < this.waveList.maxTrackLength) {
                let threshold = this.waveList.maxTrackLength - currentMaxLength;
                if (threshold <= 10) {
                    this.waveList.maxTrackLength = currentMaxLength;
                } else {
                    this.waveList.maxTrackLength -= (threshold / 2);
                }
            }

            for (var i = 0; i < this.waveList.wavesurfers.length; i++) {
                console.log(this.waveList.wavesurfers[i].backend.buffer);
                if (this.waveList.wavesurfers[i].backend.buffer !== null) {
                    this.waveList.wavesurfers[i].drawer.fireEvent("redraw");
                }
            }
        }.bind(this));

        $("#zoom_out").unbind("click");
        $("#zoom_out").click(function() {
            let currentMaxLength = 0;
            for (var i = 0; i < this.waveList.wavesurfers.length; i++) {
                let instanceLength = this.waveList.wavesurfers[i].backend.getDuration();
                if (instanceLength > currentMaxLength) {
                    currentMaxLength = instanceLength;
                }
            }

            let extension = this.waveList.maxTrackLength / 5;
            this.waveList.maxTrackLength += extension;

            for (var i = 0; i < this.waveList.wavesurfers.length; i++) {
                console.log(this.waveList.wavesurfers[i].backend.buffer);
                if (this.waveList.wavesurfers[i].backend.buffer !== null) {
                    this.waveList.wavesurfers[i].drawer.fireEvent("redraw");
                }
            }
        }.bind(this));

        $("#trim").unbind("click");
        $("#trim").click(function() {
            for (var i = 0; i < this.waveList.wavesurfers.length; i++) {
                this.waveList.wavesurfers[i].stop(0);
            }
            let wavesurfer = this.waveList.wavesurfers[this.waveList.currentRegionInfo.id];
            let params = {"wavesurfer": wavesurfer};
            let filterFunction = TrimFilter.giveEffect;
            this.showLoadingForFilterFunction(filterFunction, params);
            //TrimFilter.trim(this.waveList.currentRegionInfo, this.waveList.wavesurfers);
        }.bind(this));

        $("#mix_all").unbind("click");
        $("#mix_all").click(function() {
            Mixer.mixDownAllTracks(this.waveList);
        }.bind(this));

        /* Here are audio filters applied to a specific region */
        $("#fade_in").unbind("click");
        $("#fade_in").click(function() {
            let params = {};
            let filterFunction = FadeInFilter.giveEffect;
            this.showLoadingForFilterFunction(filterFunction, params);
        }.bind(this));

        $("#fade_out").unbind("click");
        $("#fade_out").click(function() {
            let params = {};
            let filterFunction = FadeOutFilter.giveEffect;
            this.showLoadingForFilterFunction(filterFunction, params);
        }.bind(this));

        $("#reverse").unbind("click");
        $("#reverse").click(function() {
            let params = {};
            let filterFunction = ReverseFilter.giveEffect;
            this.showLoadingForFilterFunction(filterFunction, params);
        }.bind(this));

        $("#volume").unbind("click");
        $("#volume").click(function() {
            let volumePercentage = $("#volume-ratio").val() / 100.0;
            let params = {"volume": volumePercentage};
            let filterFunction = VolumeFilter.giveEffect;
            this.showLoadingForFilterFunction(filterFunction, params);
        }.bind(this));

        $("#pitch").unbind("click");
        $("#pitch").click(function() {
            let pitchChangeValue = $("#pitch-key").val();
            let params = {"pitch": pitchChangeValue};
            let filterFunction = PitchFilter.giveEffect;
            this.showLoadingForFilterFunction(filterFunction, params);
        }.bind(this));
    }

    showLoadingForFilterFunction(filterFunction, params) {
        $("#loading").show();
        setTimeout(() => {
            let filterPlugin = FilterPlugin.create(filterFunction, params);
            filterPlugin.applyFilter(this.waveList.currentRegionInfo, this.waveList.wavesurfers, filterFunction, params);
            this.waveList.removeRegion();
            $("#loading").hide();
        }, 0);
    }
}