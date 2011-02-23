var {Application} = require('stick');
var log = require('ringo/logging').getLogger(module.id);

var config = require('./config');
var {error} = require('./response');
var basicAuthWithRegex = require('./middleware');

var app = exports.app = Application();
app.configure(basicAuthWithRegex, 'static', 'params', 'mount', 'upload', 'render');
app.static(module.resolve('public'), 'static');
// aut for paths containing ! and a secure action
app.basicauth(/(.*)\!(edit|files)(.*)/, config.backend.username, config.backend.password_sha1);

var actions = require('./actions');
app.mount('/', function(request) {
   // drop slahes
   var path = request.pathInfo;
   request.isPost = request.method.toLowerCase() === 'post';

   // path up to ! is page's path name. after ! comes action (optional).
   var NOCMS_REGEX = new RegExp(/^\/([^\!]*)(?:\!(edit|comment|files))?/);
   var matches = path.match(NOCMS_REGEX);
   if (matches !== null) {
      path = matches[1];
      // remove trailing /
      path = path.substring(path.length-1) === '/' ? path.substring(0, path.length-1) : path;
      var action = null;
      if (matches[2] && matches[2].length) {
         action = actions[matches[2]];
      } else {
         action = actions.servePage;
      }
      try {
         return action(request, path);
      } catch(e) {
         log.error(e);
         return error();
      }
   }
});

// Script run from command line
if (require.main === module) {
    require('stick/server').main(module.id);
}
