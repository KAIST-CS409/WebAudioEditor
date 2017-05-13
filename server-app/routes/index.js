var formidable = require('formidable');
var fs = require('fs');
var grid = require('gridfs-stream');

module.exports = function(app, mongoose, conn)
{
    app.post('/api/uploadAudio', function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (!err) {
                console.log('Files Uploaded: ' + files.file)
                grid.mongo = mongoose.mongo;
                var gfs = grid(conn.db);
                var writestream = gfs.createWriteStream({
                    filename: files.file.name
                });
                fs.createReadStream(files.file.path).pipe(writestream);
            }
        });
        form.on('end', function () {
            res.send('Completed ... go check fs.files & fs.chunks in mongodb');
        });
    });
    app.get('/api/downloadAudio', function (req, res) {
    });
}
