/**
 * @fileOverview Basic Authentication middleware.
 *
 * Like sticks' normal basicauth but accepts regex
 */

var strings = require('ringo/utils/strings');
var base64 = require('ringo/base64');

/**
 *
 * @param {Function} next the wrapped middleware chain
 * @param {Object} app the Stick Application object
 * @returns {Function} a JSGI middleware function
 */
exports.middleware = function basicauth(next, app) {

    var config = {};

    app.basicauth = function(path, role, sha1) {
        config[path] = {};
        config[path].regex = new RegExp(path);
        config[path][role] = sha1;
    };

    return function basicauth(req) {
        // normalize multiple slashes in request path
        var path = (req.scriptName + req.pathInfo).replace(/\/+/g, '/');
        var toAuth;
        for each (var realm in config) {
            if (realm.regex.test(path)) {
                toAuth = realm;
                break;
            }
        }
        if (toAuth) {
            if (req.headers.authorization) { // Extract credentials from HTTP.
                var credentials = base64.decode(req.headers.authorization
                        .replace(/Basic /, '')).split(':');
                if (strings.digest(credentials[1], 'sha1') === toAuth[credentials[0]]) {
                    req.session.data.isAuthorized = true;
                    return next(req); // Authorization.
                }
            }
            var msg = '401 Unauthorized';
            return { // Access denied.
                status: 401,
                headers: {
                    'Content-Type': 'text/html',
                    'WWW-Authenticate': 'Basic realm="Secure Area"'
                },
                body: [
                    '<html><head><title>', msg, '</title></head>',
                    '<body><h1>', msg, '</h1>',
                    '</body></html>'
                ]
            };
        }
        return next(req);
    }
};
