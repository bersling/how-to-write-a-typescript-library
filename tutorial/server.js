"use strict";
exports.__esModule = true;
var connect = require("connect");
var serveStatic = require("serve-static");
var options = {
    extensions: ['html']
};
connect().use(serveStatic(__dirname + '/dist', options)).listen(8081, function () {
    console.log('Server running on 8081...');
});
