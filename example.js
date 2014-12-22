/**
 * Created by VladimirVS on 22.12.2014.
 */

var http = require("http");
var simplestatic = require("./simplestatic");

var server = http.createServer(function(req, res) {
    if (simplestatic.sendFile(req, res)) { return; } // process file request
    res.end("This request is not a file."); // process other request
});

server.listen("3000");
