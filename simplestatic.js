/**
 * Created by VladimirVS on 03.12.2014.
 */

var fs = require('fs');

var fileList = {};

var mimes = {js: "application/javascript", json: "application/json", css: "text/css", html: "text/html",
    htm: "text/html", gif: "image/gif", jpg: "image/jpeg", png: "image/png"};

function getMime(fname) {
    var ext = fname.substr(fname.lastIndexOf(".") + 1, fname.length);
    ext = ext.toLowerCase();
    return mimes[ext];
}

function initFileList(path) {
    fileList[path] = {data: null, isDir: true, mime: null};
    var fList = fs.readdirSync(path);
    for (var i = 0; i < fList.length; i++) {
        var fname = path + "/" + fList[i];
        if (fs.statSync(fname).isDirectory()) { initFileList(fname); }
        else {
            var fData = fs.readFileSync(fname);
            fileList[fname] = {data: fData, isDir: false, mime: getMime(fname)};
        }
    }
}

exports.sendFile = function(req, res) {
    var path = "./static" + req.url;
    if (path[path.length - 1] === "/") { path = path.slice(0, -1); }
    var f = fileList[path];
    if (!f) { return false; }
    if (f.isDir) {
        var f = fileList[path + "/index.html"];
        if (!f) { return false; }
    }
    if (f.mime) { res.setHeader('content-type', f.mime); }
    res.end(f.data);
    return true;
}

initFileList("./static");
