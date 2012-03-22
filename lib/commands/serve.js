// stdlib
var {Application} = require('stick');
var {Server} = require('ringo/httpserver');
var fs = require('fs');
var term = require("ringo/term");

exports.serve = function(args) {
   var {Application} = require('stick');
   var log = require('ringo/logging').getLogger(module.id);

   var config = require('../config');
   if (!args[0] || !fs.isDirectory(args[0])) {
      print (args[0], " does not exist or is not a directory.")
   }
   var appPath = args[0];

   config.init(appPath);

   var {error} = require('../response');
   var authMiddleware = require('../basicauth');
   var captcha = require('../captcha');

   var app = exports.app = Application();
   app.configure('session', authMiddleware, 'static', 'upload', 'params', captcha, 'mount');
   // serve assets from custom directory
   app.static(fs.join(config.data.appPath, 'public/'));
   app.static(module.resolve('../../assets/public/'));

   // aut for paths containing ! and a secure action
   app.basicauth(/(.*)\!(edit|files)(.*)/, config.data.backend.username, config.data.backend.password_sha1);

   var actions = require('../actions');
   app.mount('/', function(request) {
      var path = request.pathInfo;
      request.isPost = request.method.toLowerCase() === 'post';

      // path up to ! is page's path name. after ! comes action (optional).
      var NOCMS_REGEX = new RegExp(/^\/([^\!]*)(?:\!(edit|comment|files))?/);
      var matches = path.match(NOCMS_REGEX);
      if (matches !== null) {
         path = matches[1];
         // remove trailing /
         path = path.substring(path.length-1) === '/' ? path.substring(0, path.length-1) : path;
         // if search engine request: return canonical html now
         // @see http://www.google.com/support/webmasters/bin/answer.py?hl=en&answer=174992
         if (request.params._escaped_fragment_ !== undefined) {
            return actions.canonicalPage(request, path);
         }

         var action = null;
         if (matches[2] && matches[2].length) {
            action = actions[matches[2]];
         } else {
            action = actions.page;
         }
         try {
            return action(request, path);
         } catch(e) {
            log.error(e);
            return error();
         }
      }
      return notfound;
   });

   var httpServer = require('ringo/httpserver').Server({app: app});
   httpServer.start();
}

exports.help = function help() {
   term.writeln("\nServe a nocms instance.\n");
   term.writeln("Usage:");
   term.writeln("  ositestats serve /var/www/nocms-foo/");
   return;
};

exports.info = function info() {
   term.writeln(term.BOLD, "\tserve", term.RESET, "-", "Serve a nocms instance");
}
