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
   data.store = new Store(config.store, {
         maxConnections: 100,
         cacheSize: 100
      }
   );
   // backend pages are http basic auth protected
   data.backend = config.backend || {};

   data.files = config.files || {
      // must be writeable for ringo
      uploadDirectory: getResource('../assets/public/files'),
      // you can change this to absolute uri and serve by apache, etc
      baseUrl: '/files/',
   }
}