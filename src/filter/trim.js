import FileDownloader from '../fileDownloader.js';

export default class Trim {
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
}