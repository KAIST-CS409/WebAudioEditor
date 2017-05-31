import $ from 'jquery';
import 'dist/css/bootstrap.css';
import 'dist/js/bootstrap.min.js';
import 'css/index.css';
import 'css/library.css';

import AudioLibrary from './library/audioLibrary';

$(document).ready(function() {
    let audioLibrary = AudioLibrary.create({});
});