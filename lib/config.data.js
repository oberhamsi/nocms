exports.store = {
   "url": "jdbc:mysql://localhost/foo-database/",
   "driver": "com.mysql.jdbc.Driver",
   "username": "foo-user",
   "password": "foo-password"
};

exports.backend = {
   "username": "nocms",
   "password_sha1": "964CAB4BB4A5111731B0C00DBB43F794698D8731"
};

exports.files = {
   "uploadDirectory": getResource('./public/files'),
   "baseUrl": "files"
};