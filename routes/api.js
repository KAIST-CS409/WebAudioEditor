var formidable = require('formidable');
var fs = require('fs');
var grid = require('gridfs-stream');
var async = require('async');

module.exports = function(app, mongoose, conn, User)
{
    //create new user
    app.post('/user', function (req, res) {
        var newuser = new User();
        newuser.username = req.body["username"];
        newuser.password = req.body["password"];

        User.findOne({username: req.body["username"]}, function(err, user){
            if(err) {
                res.status(500).json({
                    result: -1,
                    message: err
                });
                return;
            } else if(!user) {
                newuser.password = newuser.generateHash(newuser.password);
                newuser.save(function(err){
                    if(err) {
                        console.error(err);
                        res.status(500).json({
                            result: -1,
                            message: err
                        });
                        return;
                    }
                    res.status(201).json({
                        result: 1,
                        message: 'successful'
                    });
                });
            } else {
                res.status(404).json({
                    result: 0,
                    message: 'username exists'
                });
                return;
            }
        });
    });

    //login
    app.post('/signin', function (req, res){
        var sess = req.session;

        User.findOne({username: req.body["username"]}, function(err, user){
            if(err) {
                res.status(500).json({
                    result: -1,
                    message: err
                });
                return;
            } else if(!user) {
                res.status(404).json({
                    result: 0,
                    message: 'invalid username'
                });
                return;
            } else if(!user.validateHash(req.body["password"])) {
                res.status(404).json({
                    result: 0,
                    message: 'invalid password'
                });
                return;
            } else {
                sess.username = user.username;
                res.status(200).json({
                    result: 1,
                    message: 'successful'
                });
            }
        });
    });

    //logout
    app.get('/signout', function (req, res){
        var sess = req.session;
        if(sess.username){
            req.session = null;
            res.redirect('/'); // TODO: NEED TO BE CONSIDERED
        } else {
            res.redirect('/'); // TODO: NEED TO BE CONSIDERED
        }
    });

    app.get('/checkstatus', (req, res) => {
        if(typeof req.session.username === "undefined") {
            return res.status(401).json({
                error: 1
            });
        }

        res.json({ username: req.session.username});
    });

    //upload new audio to user's data space
    app.post('/audio', function (req, res) {
        var sess = req.session;
        if(sess.username){
            var form = new formidable.IncomingForm();
            var fid;
            form.parse(req, function (err, fields, files) {
                if (!err) {
                    console.log('Files Uploaded: ' + files.file)
                    grid.mongo = mongoose.mongo;
                    var gfs = grid(conn.db);
                    var writestream = gfs.createWriteStream({
                        filename: files.file.name
                    });
                    fs.createReadStream(files.file.path).pipe(writestream);
                    fid = writestream.id;
                }
                if (err) {
                    res.status(500).json({
                        result: -1,
                        message: err
                    });
                    return;
                }
            });
            form.on('end', function (err) {
                if (err) {
                    res.status(500).json({
                        result: -1,
                        message: err
                    });
                    return;
                } else {
                    User.findOne({username: sess.username}, function(err, user){
                        if(err) {
                            res.status(500).json({
                                result: -1,
                                message: err
                            });
                            return;
                        } else if(!user) {
                            res.status(500).json({
                                result: -1,
                                message: 'error'
                            });
                            return;
                        } else {
                            user.audioIDs.push(fid);
                            user.save(function(err){
                                if(err) {
                                    console.error(err);
                                    res.status(500).json({
                                        result: -1,
                                        message: err
                                    });
                                    return;
                                }
                                res.status(201).json({
                                    result: 1,
                                    message: 'successful',
                                    audio_id: fid
                                });
                            });
                        }
                    });
                }
            });
        } else {
            res.redirect('/'); // TODO: NEED TO BE CONSIDERED
        }
    });

    //upload new audio to user's data space
    app.post('/temp/audio', function (req, res) {
        var sess = req.session;
        if(sess.username){
            var form = new formidable.IncomingForm();
            var fid;
            form.parse(req, function (err, fields, files) {
                if (!err) {
                    console.log('Files Uploaded: ' + files.file)
                    grid.mongo = mongoose.mongo;
                    var gfs = grid(conn.db);
                    var writestream = gfs.createWriteStream({
                        filename: files.file.name
                    });
                    fs.createReadStream(files.file.path).pipe(writestream);
                    fid = writestream.id;
                }
                if (err) {
                    res.status(500).json({
                        result: -1,
                        message: err
                    });
                    return;
                }
            });
            form.on('end', function (err) {
                if (err) {
                    res.status(500).json({
                        result: -1,
                        message: err
                    });
                    return;
                } else {
                    User.findOne({username: sess.username}, function(err, user){
                        if(err) {
                            res.status(500).json({
                                result: -1,
                                message: err
                            });
                            return;
                        } else if(!user) {
                            res.status(500).json({
                                result: -1,
                                message: 'error'
                            });
                            return;
                        } else {
                            user.tempIDs.push(fid);
                            user.save(function(err){
                                if(err) {
                                    console.error(err);
                                    res.status(500).json({
                                        result: -1,
                                        message: err
                                    });
                                    return;
                                }
                                res.status(201).json({
                                    result: 1,
                                    message: 'successful',
                                    audio_id: fid
                                });
                            });
                        }
                    });
                }
            });
        } else {
            res.redirect('/'); // TODO: NEED TO BE CONSIDERED
        }
    });

    //download audiofile
    app.get('/audio/:_id', function (req, res) {
        var sess = req.session;
        if(sess.username){
            grid.mongo = mongoose.mongo;
            var gfs = grid(conn.db);
            var fid = req.params._id;
            gfs.exist({ _id: fid }, function(err, found) {
                if (err) { 
                    res.status(500).json({
                        result: -1,
                        message: err
                    });
                    return;
                } else if (!found) {
                    res.status(404).json({
                        result: 0,
                        message: 'invalid audio fileID'
                    });
                    return;
                } else {
                    gfs.createReadStream({ _id: fid }).pipe(res);
                }
            });
        } else {
            res.redirect('/'); // TODO: NEED TO BE CONSIDERED
        }
    });

    //delete audiofile
    app.delete('/audio/:_id', function (req, res) {
        var sess = req.session;
        if(sess.username){
            grid.mongo = mongoose.mongo;
            var gfs = grid(conn.db);
            var fid = req.params._id;
            gfs.exist({ _id: fid }, function(err, found) {
                if (err) {
                    res.status(500).json({
                        result: -1,
                        message: err
                    });
                    return;
                } else if (!found) {
                    res.status(404).json({
                        result: 0,
                        message: 'invalid audio fileID'
                    });
                    return;
                } else {
                    gfs.remove({ _id: fid }, function (err) {
                        if (err) {
                            res.status(500).json({
                                result: -1,
                                message: err
                            }); 
                            return;
                        } else {
                            User.findOne({username: sess.username}, function(err, user){
                                if(err) {
                                    res.status(500).json({
                                        result: -1,
                                        message: err
                                    });
                                    return;
                                } else if(!user) {
                                    res.status(500).json({
                                        result: -1,
                                        message: 'error'
                                    });
                                    return;
                                } else {
                                    user.audioIDs.pop(fid);
                                    user.save(function(err){
                                        if(err) {
                                            console.error(err);
                                            res.status(500).json({
                                                result: -1,
                                                message: err
                                            });
                                            return;
                                        }
                                        res.status(200).json({
                                            result: 1,
                                            message: 'successful'
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.redirect('/'); // TODO: NEED TO BE CONSIDERED
        }
    });

    //get list of audio files of user
    app.get('/user/audio', function (req, res) {
        var items = [];
        var sess = req.session;
        if(sess.username){
            User.findOne({username: sess.username}, function(err, user){
                if(err) {
                    res.status(500).json({
                        result: -1,
                        message: err
                    });
                    return;
                } else if(!user) {
                    res.status(500).json({
                        result: -1,
                        message: 'error'
                    });
                    return;
                } else {
                    var fidArray = user.audioIDs;
                    async.forEachOf(fidArray, function (value, key, callback){
                        conn.db.collection('fs.files').findOne({'_id': value}, function(err, item) {
                            if (err) {
                                return callback(err);
                            } else {
                                items.push(item);
                            }
                            callback();
                        });
                    }, function(errs) {
                        if (err) {
                            res.status(500).json({
                                result: -1,
                                message: err
                            });
                            return;
                        } else {
                            res.status(200).json(items);
                        }
                    });
                }
            });
        } else {
            res.redirect('/'); // TODO: NEED TO BE CONSIDERED
        }
    });
}
