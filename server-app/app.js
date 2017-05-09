var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://52.79.87.203:27017/mongodb_tutorial');

var port = process.env.PORT || 3004;
var fs = require('fs');
var Grid = require('gridfs-stream');
var conn = mongoose.connection;
var router = require('./routes')(app, fs, Grid, conn, mongoose);

conn.on('error', console.error);
conn.once('open', function(){
    console.log("Connected to mongod server");
});

var router = require('./routes')(app, fs, Grid, conn);

var server = app.listen(port, function(){
    console.log("Express server has started on port " + port)
});
