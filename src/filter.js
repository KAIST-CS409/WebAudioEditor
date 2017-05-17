import FileDownloader from 'fileDownloader.js'

export default class FilterPlugin {

    constructor() {

    };

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
                window.alert("ERROR : Region is placed on outside of audio. [TRIM]");
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
            }
        }
        else {
            window.alert("ERROR : Region not selected for operation. [TRIM]");
            // ERROR: User must specify trim region.
            // Show error message to user.
        }
    }

    static volume(regionInfo, wavesurfers) {
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
                window.alert("ERROR : Region is placed on outside of audio. [TRIM]");
                // ERROR: Without this management,
                // Uncaught (in promise) DOMException: Unable to decode audio data
                // UNLESS : Try to make trim in void area.
            }

            else {
                let audioLengthInBuffer = selectedTrackBuffer.length;
                let startPositionInBuffer = parseInt(startPositionInSec / audioLengthInSec * audioLengthInBuffer);
                let endPositionInBuffer = parseInt(endPositionInSec / audioLengthInSec * audioLengthInBuffer);

                let volumePercentage = $("#volume-ratio").val() / 100.0;

                for (var channelNumber = 0; channelNumber < selectedTrackBuffer.numberOfChannels; channelNumber++){
                    var channelData = selectedTrackBuffer.getChannelData(channelNumber);
                    for (var cursor = startPositionInBuffer; cursor < endPositionInBuffer; cursor++){
                        channelData[cursor] *= volumePercentage;
                    }
                }
                wavesurfers[regionInfo.id].drawer.fireEvent("redraw");
            }
        }
        else {
            window.alert("ERROR : Region not selected for operation. [TRIM]");
            // ERROR: User must specify trim region.
            // Show error message to user.
        }
    }

    static fadeIn(regionInfo, wavesurfers) {
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
                window.alert("WARNING : Region is placed on outside of audio. [FADE-IN]");
                // Warning
            }

            else{
                let audioLengthInBuffer = selectedTrackBuffer.length;
                let startPositionInBuffer = parseInt(startPositionInSec / audioLengthInSec * audioLengthInBuffer);
                let endPositionInBuffer = parseInt(endPositionInSec / audioLengthInSec * audioLengthInBuffer);
                let regionLengthInBuffer = endPositionInBuffer - startPositionInBuffer;

                for (var channelNumber = 0; channelNumber < selectedTrackBuffer.numberOfChannels; channelNumber++){
                    var channelData = selectedTrackBuffer.getChannelData(channelNumber);
                    for (var cursor = startPositionInBuffer; cursor < endPositionInBuffer; cursor++){
                        channelData[cursor] *= (cursor - startPositionInBuffer) / regionLengthInBuffer;
                    }
                }
                wavesurfers[regionInfo.id].drawer.fireEvent("redraw");
            }
        }
        else {
            window.alert("ERROR : Region not selected for operation [FADE-IN]");
            // ERROR: User must specify fade-in region.
            // Show error message to user.
        }
    }

    static fadeOut(regionInfo, wavesurfers) {
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
                window.alert("WARNING : Region is placed on outside of audio. [FADE-OUT]");
                // Warning
            }
            
            else{
                let audioLengthInBuffer = selectedTrackBuffer.length;
                let startPositionInBuffer = parseInt(startPositionInSec / audioLengthInSec * audioLengthInBuffer);
                let endPositionInBuffer = parseInt(endPositionInSec / audioLengthInSec * audioLengthInBuffer);
                let regionLengthInBuffer = endPositionInBuffer - startPositionInBuffer;

                for (var channelNumber = 0; channelNumber < selectedTrackBuffer.numberOfChannels; channelNumber++){
                    var channelData = selectedTrackBuffer.getChannelData(channelNumber);
                    for (var cursor = startPositionInBuffer; cursor < endPositionInBuffer; cursor++){
                        channelData[cursor] *= (endPositionInBuffer - cursor) / regionLengthInBuffer;
                    }
                }
                wavesurfers[regionInfo.id].drawer.fireEvent("redraw");
            }
        }
        else {
            window.alert("ERROR : Region not selected for operation [FADE-OUT]");
            // ERROR: User must specify trim region.
            // Show error message to user.
        }
    }

    static reverse(regionInfo, wavesurfers) {
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
                window.alert("WARNING : Region is placed on outside of audio. [REVERSE]");
                // Warning Concept
            }

            else{
                let audioLengthInBuffer = selectedTrackBuffer.length;
                let startPositionInBuffer = parseInt(startPositionInSec / audioLengthInSec * audioLengthInBuffer);
                let endPositionInBuffer = parseInt(endPositionInSec / audioLengthInSec * audioLengthInBuffer);
                let regionLengthInBuffer = endPositionInBuffer - startPositionInBuffer;

                for (var channelNumber = 0; channelNumber < selectedTrackBuffer.numberOfChannels; channelNumber++){
                    var channelData = selectedTrackBuffer.getChannelData(channelNumber);
                    var cloneChannel = channelData.slice();
                    for (var cursor = 0; cursor < regionLengthInBuffer; cursor++){
                        channelData[startPositionInBuffer + cursor] = cloneChannel[endPositionInBuffer - 1 - cursor];
                    }
                }
                wavesurfers[regionInfo.id].drawer.fireEvent("redraw");
            }
        }
        else {
            window.alert("ERROR : Region not selected for operation [REVERSE]");
            // ERROR: User must specify trim region.
            // Show error message to user.
        }
    }
}