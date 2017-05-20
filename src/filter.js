import FileDownloader from 'fileDownloader.js';
import Shifter from 'smbPitchShift.js';

export default class Filter {

    constructor() {

    };

    static applyFilter(regionInfo, wavesurfers, filterFunction, params) {
        if (regionInfo != null) {
            console.log(wavesurfers[regionInfo.id].backend.buffer);
            console.log(regionInfo.region.start);
            console.log(regionInfo.region.end);

            let selectedRegion = regionInfo.region;
            let selectedTrackBuffer = wavesurfers[regionInfo.id].backend.buffer;

            let audioLengthInSec = selectedTrackBuffer.duration;
            let startPositionInSec = selectedRegion.start;
            let endPositionInSec = Math.min(selectedRegion.end, audioLengthInSec);

            if (startPositionInSec >= audioLengthInSec){
                Filter.alertWithSnackbar("Error : Region not selected for operation.");
                // ERROR: User must appropriate region.
                // Region is out of audio range.
            } else {
                let audioLengthInBuffer = selectedTrackBuffer.length;
                let startPositionInBuffer = parseInt(startPositionInSec / audioLengthInSec * audioLengthInBuffer);
                let endPositionInBuffer = parseInt(endPositionInSec / audioLengthInSec * audioLengthInBuffer);
                let regionLengthInBuffer = endPositionInBuffer - startPositionInBuffer;

                filterFunction(selectedTrackBuffer, startPositionInBuffer, endPositionInBuffer, params);
                wavesurfers[regionInfo.id].drawer.fireEvent("redraw");
            }
        }
        else {
            Filter.alertWithSnackbar("Error : Region not selected for operation.");
            // ERROR: User must specify region.
            // Show error message to user.
        }
    }

    static trim(regionInfo, wavesurfers) {
        if (regionInfo != null) {
            console.log(wavesurfers[regionInfo.id].backend.buffer);
            console.log(regionInfo.region.start);
            console.log(regionInfo.region.end);

            let selectedRegion = regionInfo.region;
            let selectedTrackBuffer = wavesurfers[regionInfo.id].backend.buffer;

            let audioLengthInSec = selectedTrackBuffer.duration;
            let startPositionInSec = selectedRegion.start;
            let endPositionInSec = selectedRegion.end;

            if (startPositionInSec >= audioLengthInSec){
                Filter.alertWithSnackbar("Error : Region is placed on outside of audio.");
                // ERROR: Without this management,
                // Uncaught (in promise) DOMException: Unable to decode audio data
                // UNLESS : Try to make trim in void area.
            }

            else {
                let audioLengthInBuffer = selectedTrackBuffer.length;
                let startPositionInBuffer = startPositionInSec / audioLengthInSec * audioLengthInBuffer;
                let endPositionInBuffer = endPositionInSec / audioLengthInSec * audioLengthInBuffer;

                let blob = FileDownloader.saveToWav(selectedTrackBuffer,
                    startPositionInBuffer, endPositionInBuffer, true, wavesurfers[regionInfo.id]);
                regionInfo.region.remove();
                regionInfo = null;
            }
        }
        else {
            Filter.alertWithSnackbar("Error : Region not selected for operation.");
            // ERROR: User must specify trim region.
            // Show error message to user.
        }
    }

    static volume(selectedTrackBuffer, startPositionInBuffer, endPositionInBuffer, params) {
        let volumePercentage = params["volume"];
        for (var channelNumber = 0; channelNumber < selectedTrackBuffer.numberOfChannels; channelNumber++){
            var channelData = selectedTrackBuffer.getChannelData(channelNumber);
            for (var cursor = startPositionInBuffer; cursor < endPositionInBuffer; cursor++){
                channelData[cursor] *= volumePercentage;
            }
        }
    }

    static fadeIn(selectedTrackBuffer, startPositionInBuffer, endPositionInBuffer, params) {
        let regionLengthInBuffer = endPositionInBuffer - startPositionInBuffer;
        for (var channelNumber = 0; channelNumber < selectedTrackBuffer.numberOfChannels; channelNumber++){
            var channelData = selectedTrackBuffer.getChannelData(channelNumber);
            for (var cursor = startPositionInBuffer; cursor < endPositionInBuffer; cursor++){
                channelData[cursor] *= (cursor - startPositionInBuffer) / regionLengthInBuffer;
            }
        }
    }

    static fadeOut(selectedTrackBuffer, startPositionInBuffer, endPositionInBuffer, params) {
        let regionLengthInBuffer = endPositionInBuffer - startPositionInBuffer;
        for (var channelNumber = 0; channelNumber < selectedTrackBuffer.numberOfChannels; channelNumber++){
            var channelData = selectedTrackBuffer.getChannelData(channelNumber);
            for (var cursor = startPositionInBuffer; cursor < endPositionInBuffer; cursor++){
                channelData[cursor] *= (endPositionInBuffer - cursor) / regionLengthInBuffer;
            }
        }
    }

    static reverse(selectedTrackBuffer, startPositionInBuffer, endPositionInBuffer, params) {
        let regionLengthInBuffer = endPositionInBuffer - startPositionInBuffer;
        for (var channelNumber = 0; channelNumber < selectedTrackBuffer.numberOfChannels; channelNumber++){
            var channelData = selectedTrackBuffer.getChannelData(channelNumber);
            var cloneChannel = channelData.slice();
            for (var cursor = 0; cursor < regionLengthInBuffer; cursor++){
                channelData[startPositionInBuffer + cursor] = cloneChannel[endPositionInBuffer - 1 - cursor];
            }
        }
    }


    static pitch(selectedTrackBuffer, startPositionInBuffer, endPositionInBuffer, params) {
        let pitchKeyChange = params["pitch"];
        let singleKeyChange = Math.pow(2.0, 1.0/12);
        let pitchRatio = Math.pow(singleKeyChange, pitchKeyChange);
        for (var channelNumber = 0; channelNumber < selectedTrackBuffer.numberOfChannels; channelNumber++){
            var channelData = selectedTrackBuffer.getChannelData(channelNumber).slice(startPositionInBuffer, endPositionInBuffer);
            var originalChannelData = selectedTrackBuffer.getChannelData(channelNumber);
            Shifter.shift(pitchRatio, selectedTrackBuffer.sampleRate, channelData, function() {
                for (var i=0; i<endPositionInBuffer - startPositionInBuffer; i++) {
                    originalChannelData[i + startPositionInBuffer] = channelData[i];
                }
            });
        }
    }

    static alertWithSnackbar(message) {
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
}