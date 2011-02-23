$(document).ready(function() {

   var page = JSON.parse($('#nocms-json-page').text());
   // fill form
   var extendedTitle = 'Page "' + page.title + '" at url /' + page.path + '';

   $('title').text(extendedTitle);
   $('#nocms-path').html(extendedTitle);
   ['title', 'text'].forEach(function(key) {
      $('#nocms-' + key).val(page[key]);
   });

   // render comments
   var $comments = $.tmpl($('#nocms-comment-template'), page.comments);
   $('#nocms-comments').append($comments);

   // preview UI
   var converter = new Showdown.converter();
   function renderPreview() {
      var $text = converter.makeHtml($('#nocms-text').val());
      $("#nocms-text-preview").html($text);
   }
   renderPreview();
   $("#nocms-button-preview").click(function(event) {
      renderPreview();
      event.preventDefault();
   });

   // save UI
   $(document).keydown(function(event) {
      var key = event.keyCode || event.which;
      // 83 = s
      if (event.ctrlKey) {
         if (key === 83) {
            $('#nocms-redirect').val(window.location.pathname);
            $('#nocms-form-page').submit();
            return false;
         } else if (key === 80) {
            renderPreview();
            return false;
         }
      }
   });

   return;
});
