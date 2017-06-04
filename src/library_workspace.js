import $ from 'jquery';
import 'dist/css/bootstrap.css';
import 'dist/js/bootstrap.min.js';
import 'css/index.css';
import 'css/library.css';

import WorkspaceLibrary from './library/workspaceLibrary';

$(document).ready(function() {
    let workspaceLibrary = WorkspaceLibrary.create({});
    workspaceLibrary.requestWorkspaceList(false);
});