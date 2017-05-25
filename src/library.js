import $ from 'jquery';
import 'dist/css/bootstrap.css';
import 'dist/js/bootstrap.min.js';
import 'css/index.css';
import 'css/library.css';

$(document).ready(function() {
    /* Referred http://webdir.tistory.com/435 */
    $.ajax({
        url: "/user/audio",
        type: "GET",
        success: (data) => {
            console.log(data);
        },
        error: (data) => {
            console.log("error: " +data);
        }
    });

    $("#upload-audio").on("change", function (){
        let audioFile = this.files[0];
        let formData = new FormData();
        formData.append("file", audioFile);
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


        let row = `<tr>
                        <td> ${filename} </td>
                        <td> ${dateString} </td>
                        <td> ${filesize}MB </td>
                        <td>
                            <button id="audio0" class="btn btn-sm btn-default">Download</button>
                            <button id="delete0" class="btn btn-sm btn-default">Delete</button>
                        </td>
                   </tr>`;

        $('#audio-table > tbody:last-child').append(row);

        $.ajax({
            url: "/audio",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: (data) => {
                console.log(data);
            },
            error: (data) => {
                console.log("error: " +data);
            }
        });

    });
});

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision;
};