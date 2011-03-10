var {badrequest} = require('./response');

var QUESTIONS = {
   'Are you human?': true,
   'Are you a robot?': false
};

var Q = 'nocms-captcha-question';
var A = 'nocms-captcha-answer';

exports.middleware = function captcha(next, app) {

   return function captcha(req) {
      /**
       * if question is set, it's answer is tested
       */
      // FIXME authorization easy to circument if you know what you need to do (set auth header)
      if (!req.session.data.isAuthorized && req.method.toLowerCase() == 'post') {
         var answer = req.params[A];
         if (!answer || typeof(answer) != 'string') {
            req.session.data[Q] = null;
            return badrequest();
         }
         var answer = answer.toLowerCase().trim();
         // weird switch statement to get cheap undef
         var boolAnswer = {'yes': true,
                           'no': false
                          }[answer];
         if (boolAnswer === undefined) {
            return badrequest();
         }
         var question = req.session.data[Q];
         if (QUESTIONS[question] === boolAnswer) {
            req.session.data[Q] = null;
            return next(req);
         } else {
            return badrequest();
         }
      } else {
         return next(req);
      }
   };
};

/**
 * set question in session data
 * @returns question tags
 */
exports.getQuestion = function(req) {
   // kind of random order
   var questions = Object.keys(QUESTIONS);
   var rnd = parseInt(Math.random() * questions.length, 10);
   req.session.data[Q] = questions[rnd];
   return questions[rnd];
};
