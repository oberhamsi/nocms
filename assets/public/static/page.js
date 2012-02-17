// JSON fallback
if (!window.JSON) {
   window.JSON = {
      parse: function(txt) {
         return eval('(' + txt + ')');
      }
   };
};
// Array.map fallback
if (!Array.prototype.map) {
   Array.prototype.map = function(fun /*, thisp */) {
      "use strict";

      if (this === void 0 || this === null) throw new TypeError();

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== "function") throw new TypeError();

      var res = new Array(len);
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
      if (i in t)
         res[i] = fun.call(thisp, t[i], i, t);
      }
      return res;
   };
};

$(document).ready(function() {

   /**
    * df = dateformat
    * render unix timestamp into human redable date
    */
   var MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dez'];
   function df(date) {
      function xp(v) {
         v = String(v);
         return v.length < 2 ? ('0' + v) : v;
      }
      date = new Date(date);
      var hours = xp(date.getHours());
      var minutes = xp(date.getMinutes());
      var day = xp(date.getDate());
      var month = MONTHS[date.getMonth()];
      var year = date.getFullYear();

      var now = new Date();
      var result = 'today, ' + hours + ':' + minutes;
      if (year !== now.getFullYear() ||
          month !== MONTHS[now.getMonth()] ||
          day !== xp(now.getDate())
       ) {
         result = day + '.' + month;
      };
      if (year != now.getFullYear()) {
         result = result + ' ' + year;
      }
      return result;
   };

   // render page data
   var page = JSON.parse($('#nocms-json-page').html());
   $('#nocms-title').text(page.title);
   try {
      $('title').text(page.title);
   } catch (e) {
      // ie bug
   }
   var converter = new Showdown.converter();
   var html = converter.makeHtml(page.text)
   $('#nocms-text').html(html);
   var meta = [
      'created: ' + df(page.created),
      'updated: ' + df(page.updated)
   ].join('<br/>');
   $('#nocms-page-meta').html(meta);

   // recently created pages
   var recent = JSON.parse($('#nocms-json-recent').html());
   var MAX_LEN = 30;
   recent.pages = recent.pages.map(function(p) {
      var dots = "";
      if (p.title.length > MAX_LEN) {
         dots = "...";
      }
      p.title = p.title.substr(0, MAX_LEN) + dots || '(missing title)';
      p.created = df(p.created);
      return p;
   });
   var $recent = $.tmpl($('#nocms-recent-page-template'), recent.pages);
   $('#nocms-recent-pages').html($recent);

   // render comment list
   var $comments = $.tmpl($('#nocms-comment-template'), page.comments);
   $('#nocms-comments').html($comments);

   // create comment form UI
   $('#nocms-comments-wrapper').hide();
   $('#nocms-button-comment').click(function(event) {
      $(this).hide();
      $('#nocms-comments-wrapper').show();
      event.preventDefault();
   });

   return;
});
