var Store = require("ringo-sqlstore").Store;
var fs = require('fs');

/**
 * Create mysql store
 */
var data = exports.data = module.singleton('data', function() {
   return {};
});

exports.init = function(path) {
   var config = require(fs.join(path, 'config.data.js'));
   data.appPath = path;
   data.store = new Store(config.store, {
         maxConnections: 100,
         cacheSize: 100
      }
   );
   // backend pages are http basic auth protected
   data.backend = config.backend || {};

   data.files = {
      uploadDirectory: fs.join(path, 'public/upload'),
      baseUrl: 'upload/'
   };
}