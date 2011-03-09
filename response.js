/**
 * @fileoverview JSGI Response Helpers
 */

export('redirect', 'respond', 'error', 'notfound', 'badrequest');

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

function error() {
   return {
      status: 200, // 500,
      headers: {'Content-Type': 'text/html'},
      body: ['<h1>500 Internal Server Error</h1> <quote>You know what they say about me? I suck!</quote>']
   }
};

function notfound() {
   return {
      status: 200, // 404,
      headers: {'Content-Type': 'text/html'},
      body: ["<h1>404 Not Found</h1> <quote>If we don't got it, you don't want it!</quote>"]
   };
};

function badrequest() {
   return {
      status: 200, // 400 bad request
      headers: {'content-Type': 'text/html'},
      body: ["<h1>400 Bad request</h1> <quote>Die in a fire!</quote>"]
   };
};
