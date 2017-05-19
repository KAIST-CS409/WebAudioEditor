var formidable = require('formidable');
var fs = require('fs');
var grid = require('gridfs-stream');

module.exports = function(app, mongoose, conn, User)
{
    app.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }
        res.json({result: 1});
        });
    });

    app.get('/login/:username/:password', function (req, res){
        var sess = req.session;
        var result = {};

        User.findOne({username: req.params.username}, function(err, user){
            if(err)
                return res.status(500).json({error: err});
            if(!user)
                return res.status(404).json({error: 'invalid username'});
            if(user.password != req.params.password)
                return res.status(404).json({error: 'invalid password'});
            else{
                result["success"] = 1;
                sess.username = username;
                res.json(result);
            }
        });
    });

    app.get('/logout', function (req, res){
        var sess = req.session;
        if(sess.username){
            req.session.destroy(function(err){
                if(err){
                    con
                }
            })
        }
    });


asdf;lkjasd;flkjas
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
            if (err) {
                res.status(404).json({
                    status: 404,
                    message: 'Upload Error'
                });
            }
        });
        form.on('end', function (err) {
            if (err) {
                res.status(404).json({
                    status: 404,
                    message: 'Upload Error'
                });
            } else {
                res.status(200).json({
                    status: 200,
                    message: 'Upload Successful'
                });
            }
        });
    });
    app.post('/api/downloadAudio', function (req, res) {
        grid.mongo = mongoose.mongo;
        var gfs = grid(conn.db);
        var aid = req.body["audio_id"];
        gfs.exist({ _id: aid }, function(err, found) {
            if (err) {
                handleError(err); 
                res.status(404).json({
                    status: 404,
                    message: 'Download Error'
                });
            } else if (!found) {
                res.send('Error on the database looking for the file.' + aid)
                res.status(404).json({
                    status: 404,
                    message: 'File does not exist'
                });
            } else {
                gfs.createReadStream({ _id: aid }).pipe(res);
            }
        });
    });

    app.post('/api/deleteAudio', function (req, res) {
        grid.mongo = mongoose.mongo;
        var gfs = grid(conn.db);
        var aid = req.body["audio_id"];
        gfs.exist({ _id: aid }, function(err, found) {
            if (err) {
                handleError(err); 
                res.status(404).json({
                    status: 404,
                    message: 'Delete Error'
                });
            } else if (!found) {
                res.send('Error on the database looking for the file.' + aid)
                res.status(404).json({
                    status: 404,
                    message: 'File does not exist'
                });
            } else {
                gfs.remove({ _id: aid }, function (err) {
                    if (err) {
                        res.status(404).json({
                            status: 404,
                            message: 'Delete Error'
                        });
                    } else {
                        res.status(200).json({
                            status: 200,
                            message: 'Delete Successful'
                        });
                    }
                });
            }
        });
    });

    app.get('/api/getAudioList', function (req, res) {
        conn.db.collection('fs.files').find().toArray(function(err, items) {
            if (err) {
                res.status(404).json({
                    status: 404,
                    message: 'Error'
                });
            } else {
                var response = {};
                var status = {status: 200};
                res.status(200).json(Object.assign(response, items, status));
            }
        });
    });
}
