var {Page, Comment} = require('./model');
var log = require('ringo/logging').getLogger(module.id);
var {read, write, join, list} = require('fs');
var {parseFileUpload, TempFileFactory, isFileUpload} = require('ringo/utils/http');

var captcha = require('./captcha');
var config = require('./config');
var {redirect, respond, notfound} = require('./response');
// FIXME could easily break without me noticing
var showdown = require('./public/static/lib/showdown');

export('files', 'comment', 'edit', 'page', 'canonicalPage');

var FILES_PATH = config.files.uploadDirectory;
var FILES_URL = config.files.baseUrl;

/**
 * 'render' the template. replaces {{{key}}} with data[key]
 */
function render(template, data) {
   var tmpl = read(module.resolve('./skins/' + template));
   for (var key in data) {
      tmpl = tmpl.replace('{{{' + key + '}}}', data[key]);
   }
   return tmpl;
};

/**
 * file upload helper. actually writes the file found in request into
 * file directory.
 */
function uploadFile(request, path) {
   var file = request.postParams['nocms-file'];
   if (file) {
      var name = file.filename;
      write(join(FILES_PATH, name), file.value);
      log.info('uploaded ', name);
   }
   return redirect('/' + path);
};

/**
 * show file list; upload file
 */
function files(request) {
   if (request.isPost) {
      uploadFile(request);
      return redirect('/!files');
   }
   var files = list(FILES_PATH).map(function(file) {
      return {
         name: file,
         url: FILES_URL + file
      }
   })

   files.sort(function(a,b) {
      return a.name > b.name ? 1 : -1;
   });
   var $files = render('files', {
      FILES: JSON.stringify(files)
   });
   return respond($files);
};

/**
 * create comment
 */
function comment(request, path) {
   if (request.isPost) {
      var page = Page.getByPath(path);
      var data = {
         text: request.params['nocms-text'],
         author: request.params['nocms-author'],
         page: page,
         created: new Date()
      };
      Comment.create(data);
      return redirect('/' + path);
   }
   return notfound();
};

/**
 * show page editor; update page; create page;
 */
function edit(request, path) {
   if (request.isPost) {
      var data = {
         title: request.params['nocms-title'],
         text: request.params['nocms-text']
      };
      data.path = path;
      data.updated = new Date();
      Page.create(data) || Page.update(data);

      // FIXME ringo bug
      // https://github.com/ringo/ringojs/issues#issue/126
      var deleteIds = request.params['nocmscommentdelete'];
      Comment.bulkRemove(deleteIds);

      var redir = request.params['nocms-redirect'];
      if (redir && redir.length) {
         return redirect(redir);
      }
      return redirect('/' + path);
   }

   var page = Page.getByPath(path) || null;
   var $edit = render('edit', {
      PAGE: page && JSON.stringify(page.serialize()) || JSON.stringify({path: path})
   });
   return respond($edit);
};

/**
 * Serve a page
 */
function page(request, path) {
   var page = Page.getByPath(path);
   if (!page) {
      return notfound();
   }
   var recentPages = Page.query().orderBy('created desc').limit(10).select();
   var recent = {
      pages: []
   };
   recentPages.forEach(function(rp) {
      recent.pages.push(rp.serializeMini());
   });
   var $page = render('page', {
      PAGE: JSON.stringify(page.serialize()),
      RECENT: JSON.stringify(recent),
      QUESTION: captcha.getQuestion(request)
   });
   return respond($page);
};

/**
 * Serve page content in canonical html form
 */
function canonicalPage(request, path) {
   var page = Page.getByPath(path);
   if (!page) {
      return  notfound();
   }
   var converter = new showdown.Showdown.converter();
   var text = converter.makeHtml(page.text);
   var $page = render('page-canonical', {
      TITLE: page.title,
      TEXT: text
   });
   return respond($page);
};
