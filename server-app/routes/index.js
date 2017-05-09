module.exports = function(app, fs, Grid, conn, mongoose)
{
    app.get('/api/download', function(req, res){
        res.end();
    });

    app.post('/api/upload', function(req, res){
        var gfs = Grid(conn.db, mongoose.mongo);

        var writestream = gfs.createWriteStream({
            filename: req.body.filename
        });
        fs.createReadStream(req.body.file).pipe(writestream);

        writestream.on('error', function (err) {
            console.log('An error occurred!', err);
            return;
        });

        writestream.on('close', function (file) {
            console.log(file.filename + 'Written To DB');
            res.json({result: 1});
            return;
        });



    });
}
