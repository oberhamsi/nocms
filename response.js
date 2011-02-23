/**
 * @fileoverview JSGI Response Helpers
 */

export('redirect', 'respond', 'error', 'notfound');

function redirect(path) {
   return {
      status: 302,
      headers: {'Location': path},
      body: []
   };
};

function respond(body) {
   return {
      status: 200,
      headers: {'Content-Type': 'text/html'},
      body: [body]
   };
};

function error(body) {
   return {
      status: 200, // 500,
      headers: {'Content-Type': 'text/html'},
      body: ['<h1>500</h1> <quote>You know what they say about me? I suck!</quote>']
   }
};

function notfound(body) {
   return {
      status: 200, // 404,
      headers: {'Content-Type': 'text/html'},
      body: ["<h1>404</h1> <quote>If we don't got it, you don't want it!</quote>"]
   };
};
