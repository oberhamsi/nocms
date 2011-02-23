$(document).ready(function() {
   var files = JSON.parse($('#nocms-json-files').text());

   files = files.map(function(c) {
      var md = '![' + c.name +'](' + c.url +')';
      return {
         name: c.name,
         url: c.url,
         markdown: md
      };
   });

   var $files = $.tmpl($('#nocms-file-template'), files);
   $('#nocms-files').html($files);
   return;
});
