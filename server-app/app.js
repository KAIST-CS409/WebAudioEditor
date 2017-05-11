var mongoose = require("mongoose");
var express = require("express");
var bodyparser = require("body-parser");
var app = express();

mongoose.connect("mongodb://52.79.87.203:27017/mongodb_tutorial");
var conn = mongoose.connection;

var port = process.env.PORT || 3004;

var server = app.listen(port, function(){
    console.log("Express server has started on port " + port)
});

app.use(bodyparser.json());

var router = require('./routes')(app, mongoose, conn)
