// mysql database, username and password
exports.store = {
   database: 'nocms',
   username: 'nocms',
   password: 'nocms',
};

// backend pages are http basic auth protected
exports.backend = {
   username: 'nocms',
   password_sha1: '964cab4bb4a5111731b0c00dbb43f794698d8731'
};

exports.files = {
   // must be writeable for ringo
   uploadDirectory: module.resolve('./public/files'),
   // you can change this to absolute uri and serve by apache, etc
   baseUrl: '/files/',
};
