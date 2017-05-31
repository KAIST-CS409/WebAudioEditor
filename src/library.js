import $ from 'jquery';
import 'dist/css/bootstrap.css';
import 'dist/js/bootstrap.min.js';
import 'css/index.css';
import 'css/library.css';

$(document).ready(function() {
    requestAudioList();

    $("#upload-audio").on("change", function (){
        let audioFile = this.files[0];
        let formData = new FormData();
        formData.append("file", audioFile);

        $.ajax({
            url: "/audio",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: (data) => {
                console.log(data);
                let filename = audioFile.name;
                let filesize = audioFile.size / 1000 / 1000;
                filesize = roundUp(filesize, 100);

                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth()+1;
                let day = date.getDate();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                let dateString = year + "." + month + "." + day + " " + hours + ":" + minutes;
                addAudioFileRow(data.audio_id, filename, dateString, filesize);
            },
            error: (data) => {
                console.log("error: " +data);
            }
        });

    });
});

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision;
}

function parseDate(date_str) {
    var date_time = date_str.split("T");
    const [year, month, day] = date_time[0].split('-');
    const [hour, min, second] = date_time[1].replace("Z", "").split(':');

    return new Date(year, month-1, day, hour, min, second);
}

function matchFormat(date) {
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let dateString = year + "." + month + "." + day + " " + hours + ":" + minutes;
    return dateString;
}

function addAudioFileRow(id, filename, dateString, filesize) {
    let row = `<tr>
                        <td> ${filename} </td>
                        <td> ${dateString} </td>
                        <td> ${filesize}MB </td>
                        <td>
                            <button id="download" class="btn btn-sm btn-default download">Download</button>
                            <button id="delete" class="btn btn-sm btn-default delete">Delete</button>
                        </td>
                   </tr>`;

    let rowObj = $(row).appendTo('#audio-table > tbody:last-child');
    //let rowObj = $('#audio-table > tbody:last-child').append(row);

    let filenameToken = filename.split(".");
    let extension = filenameToken[filenameToken.length - 1];
    rowObj.data("fid", id);

    let downloadObj = rowObj.find(".download").first();
    downloadObj.click(function() {
        requestDownload(rowObj.data("fid"), extension);
    });

    let deleteObj = rowObj.find(".delete").first();
    deleteObj.click(function() {
        requestDelete(rowObj.data("fid"));
        rowObj.remove();
    });

}

function requestAudioList() {
    $.ajax({
        url: "/user/audio",
        type: "GET",
        success: (data) => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                let info = data[i];
                if (info == null) {
                    //TODO: server gives null sometimes. This should not happen. server deletes two file at the same time.
                    continue;
                }
                let filename = info.filename;
                let filesize = info.length / 1000 / 1000;
                filesize = roundUp(filesize, 100);
                let isoDate = info.uploadDate;
                let dateString = matchFormat(parseDate(isoDate));
                addAudioFileRow(info._id, filename, dateString, filesize);
            }
        },
        error: (data) => {
            console.log("error: " +data);
        }
    });
}

function requestDownload(fid, ext) {
    console.log("requestDownload!");
    console.log(fid);
    $.ajax({
        url: "/audio/" + fid,
        type: "GET",
        //TODO: downloaded file is crashed?
        success: (data) => {
            console.log(data.length);
            downloadAudioFile(encodeUtf8(data), "audio_file" + "." + ext);
        },
        error: (data) => {
            console.log("error: " +data.message);
        }
    });
}

/* Referred https://stackoverflow.com/questions/23451726/saving-binary-data-as-file-using-javascript-from-a-browser */
function downloadAudioFile(data, name) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    let blob = new Blob([data], {type: "application/octet-stream"});
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

function encodeUtf8(str) {
    let bytes = new Uint8Array(str.length);
    for (let i=0; i<str.length; i++)
        bytes[i] = str.charCodeAt(i);
    return bytes;
}

function requestDelete(fid) {
    $.ajax({
        url: "/audio/" + fid,
        type: "DELETE",
        success: (data) => {
            console.log(data.message);
        },
        error: (data) => {
            console.log("error: " +data.message);
        }
    });
}