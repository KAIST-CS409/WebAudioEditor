var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3004;
var Book = require('./models/book');
var router = require('./routes')(app, Book);

var server = app.listen(port, function(){
    console.log("Express server has started on port " + port)
});

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    //CONNECTED
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://52.79.87.203:27017/mongodb_tutorial');
var conn = mongoose.connection;

var fs = require('fs');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
conn.on('error', console.error);
conn.once('open', function() {
    console.log('Connected to mongod server');
    var gfs = Grid(conn.db);
    var writestream = gfs.createWriteStream({
        filename: 'test.mp3'
    });
    fs.cre

});

