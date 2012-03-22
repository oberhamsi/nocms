var log = require("ringo/logging").getLogger(module.id);
var term = require("ringo/term");
var shell = require("ringo/shell");
var fs = require('fs');
var strings = require('ringo/utils/strings');

exports.create = function create(args) {
    var path = args[0];
    if (path.substr(-1) !== '/') {
        path += '/';
    }
    if (!path || !fs.exists(path) || !fs.isDirectory(path)) {
        term.writeln(term.RED, path + ' does not exist or is not a directory.');
        return;
    }
    if (fs.exists(fs.join(path, 'config.data.js'))) {
        term.writeln(term.RED, path + ' already contains a nocms instance.');
        return;
    }
    term.writeln('Creating nocms instance in folder', term.BOLD, path, term.RESET);

    var username, pwd, pwdConfirm;
    while(!username) {
        username = shell.readln("Admin username: ").trim();
    }
    while (!pwd || (pwd !== pwdConfirm)) {
        pwd = shell.readln("Password: ", "*");
        pwdConfirm = shell.readln("Confirm password: ", "*");
        if (pwd !== pwdConfirm) {
            term.writeln(term.BOLD, "\nPasswords do not match, please try again.\n", term.RESET);
        }
    }

    var configData = fs.read(getResource('../../assets/config.data.template'));
    configData = configData.replace('{{{H2DB}}}', fs.join(path, 'nocms' ));
    configData = configData.replace('{{{USERNAME}}}', username);
    configData = configData.replace('{{{PASSWORD}}}', strings.digest(pwd, 'sha1'));
    fs.write(fs.join(path, 'config.data.js'), configData);
    // create directory for upload files
    fs.makeDirectory(fs.join(path, 'skins/'));
    fs.makeDirectory(fs.join(path, 'public/'));
    fs.makeDirectory(fs.join(path, 'public/upload/'));
    term.writeln('Serve your instance with `nocms serve ' + path + '`');
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
