var log = require("ringo/logging").getLogger(module.id);
var term = require("ringo/term");
var shell = require("ringo/shell");
var fs = require('fs');

exports.create = function create(args) {
    var path = args[0]
    if (!path || !fs.exists(path) || !fs.isDirectory(path)) {
        term.writeln(term.RED, path + ' does not exist or is not a directory');
        exports.help();
        return;
    }
    fs.copy(getResource('../../assets/config.data.js'), fs.join(path, 'config.data.js'));
    // create directory for upload files
    fs.makeDirectory(fs.join(path, 'skins/'));
    fs.makeDirectory(fs.join(path, 'public/'));
    fs.makeDirectory(fs.join(path, 'public/upload/'));
    return;
};

exports.help = function help() {
    term.writeln("\nCreates a new nocms instance.\n");
    term.writeln("Usage:");
    term.writeln("  ositestats create /var/www/ositestats-foo/");
    return;
};

exports.info = function info() {
    term.writeln(term.BOLD, "\tcreate", term.RESET, "-", "Creates a new nocms instance");
};
