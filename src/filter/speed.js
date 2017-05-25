import Shifter from './smbPitchShift.js';

export default class Speed {
    constructor() {

    };

    /*  Speed filter is a combination of pitch filter and extra processing.
        If we want to play a region 2x faster, the region should be pitched down 2x (Apply shifter with value 1/2).
        Then the region is played 2x faster, causing the region pitched up (so that pitch returns to the original) and achieve speed change. */
    static giveEffect(selectedTrackBuffer, startPositionInBuffer, endPositionInBuffer, params) {
        let speedRatio = params["speed"];
        for (var channelNumber = 0; channelNumber < selectedTrackBuffer.numberOfChannels; channelNumber++){
            var channelData = selectedTrackBuffer.getChannelData(channelNumber);
            var originalChannelData = selectedTrackBuffer.getChannelData(channelNumber);
            Shifter.shift(1.0/speedRatio, selectedTrackBuffer.sampleRate, channelData, function() {
                for (var i=0; i<endPositionInBuffer - startPositionInBuffer; i++) {
                    originalChannelData[i + startPositionInBuffer] = channelData[i];
                }
            });
        }
    }}