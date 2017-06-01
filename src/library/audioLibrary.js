export default class AudioLibrary {

    constructor(params) {

    }

    static create(params) {
        const audioLibrary = new AudioLibrary(params);
        return audioLibrary.init();
    }

    init() {
        this.requestAudioList();
        this.bindUpload();
        return this;
    }

    roundUp(num, precision) {
        return Math.ceil(num * precision) / precision;
    }

    parseDate(date_str) {
        var date_time = date_str.split("T");
        const [year, month, day] = date_time[0].split('-');
        const [hour, min, second] = date_time[1].replace("Z", "").split(':');

        return new Date(year, month-1, day, hour, min, second);
    }

    matchFormat(date) {
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        let dateString = year + "." + month + "." + day + " " + hours + ":" + minutes;
        return dateString;
    }

    addAudioFileRow(id, filename, dateString, filesize) {
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
            this.requestDownload(rowObj.data("fid"), extension);
        }.bind(this));

        let deleteObj = rowObj.find(".delete").first();
        deleteObj.click(function() {
            this.requestDelete(rowObj.data("fid"));
            rowObj.remove();
        }.bind(this));

    }

    requestAudioList() {
        $.ajax({
            url: "/user/audio",
            type: "GET",
            success: (data) => {
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    let info = data[i];
                    let filename = info.filename;
                    let filesize = info.length / 1000 / 1000;
                    filesize = this.roundUp(filesize, 100);
                    let isoDate = info.uploadDate;
                    let dateString = this.matchFormat(this.parseDate(isoDate));
                    this.addAudioFileRow(info._id, filename, dateString, filesize);
                }
            },
            error: (data) => {
                console.log("error: " +data);
            }
        });
    }

    requestDownload(fid, ext) {
        let xhr = new XMLHttpRequest();
        let url;
        xhr.addEventListener('load', function(blob) {
            if (xhr.status == 200) {
                url = window.URL.createObjectURL(xhr.response);
                this.downloadAudioFileFromUrl(url, "audio_file" + "." + ext);
            }
        }.bind(this));

        let src = "/audio/" + fid;
        xhr.open('GET', src);
        xhr.responseType = 'blob';
        xhr.send(null);
    }

    /* Referred https://stackoverflow.com/questions/23451726/saving-binary-data-as-file-using-javascript-from-a-browser
     * http://tech.chitgoks.com/2015/09/12/download-mp3-stream-via-ajax-then-load-to-html5-audio/
     */
    downloadAudioFileFromUrl(url, name) {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    requestDelete(fid) {
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

    bindUpload() {
        let library = this;
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
                    filesize = library.roundUp(filesize, 100);

                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth()+1;
                    let day = date.getDate();
                    let hours = date.getHours();
                    let minutes = date.getMinutes();
                    let dateString = year + "." + month + "." + day + " " + hours + ":" + minutes;
                    library.addAudioFileRow(data.audio_id, filename, dateString, filesize);
                },
                error: (data) => {
                    console.log("error: " +data);
                }
            });
        });
    }
}