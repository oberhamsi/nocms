var Store = require("ringo/storage/sql/store").Store;
var log = require('ringo/logging').getLogger(module.id);
var config = require('./config');

/**
 * Create mysql store
 */
var store = exports.store = new Store({
    "url": "jdbc:mysql://localhost/" + config.store.database,
    "driver": "com.mysql.jdbc.Driver",
    "username": config.store.username,
    "password": config.store.password
}, {
   maxConnections: 100,
   cacheSize: 100
});

/**
 * Page entity definition
 */
var Page = exports.Page = store.defineEntity('Page', {
   properties: {
      title: 'string',
      path: 'string',
      text: 'text',
      created: 'timestamp',
      updated: 'timestamp',
      template: 'string',
      comments: {
         type: 'collection',
         entity: 'Comment',
         foreignProperty: 'page',
         orderBy: 'created desc'
      }
   }
});

/**
 * Serialize page into json-able object
 * @returns {Object}
 */
Page.prototype.serialize = function() {
   var comments = [];
   // NOTE no map() on collections...
   for each (var c in this.comments) {
      comments.push(c.serialize());
   };
   return {
      title: this.title,
      text: this.text,
      created: this.created.getTime(),
      updated: this.updated.getTime(),
      path: this.path,
      comments: comments
   };
};

/**
 * Like serialize() but with minimal set of properties
 * @see serialize()
 * @returns {Object}
 */
Page.prototype.serializeMini = function() {
   return {
      title: this.title,
      path: this.path,
      created: this.created.getTime()
   };
};

/**
 * @returns {Object} page matching path or null
 */
Page.getByPath = function(path) {
   var pages = Page.query().equals('path', path).limit(1).select();
   return pages.length ? pages[0] : null;
};

/**
 * Updates a page if it exists.
 * @returns {Boolean} true if page was updated, false otherweise
 */
Page.update = function(data) {
   var page = Page.getByPath(data.path);
   if (page) {
      for (var key in data) {
         page[key] = data[key];
      }
      page.save();
      log.info('updated page @', data.path);
      return true;
   }
   return false;
};

/**
 * Create a page it it does not exist.
 * @returns {Boolean} true if page was created, false otherwise
 */
Page.create = function(data) {
   var page = Page.getByPath(data.path);
   if (!page) {
      data.created = data.updated;
      page = new Page(data);
      page.save();
      log.info('created page @', data.path);
      return true;
   }
   return false;
};

/**
 * Comment database entity
 */
var Comment = exports.Comment = store.defineEntity('Comment', {
   properties: {
      author: 'string',
      text: 'text',
      created: 'timestamp',
      page: {
         type: 'object',
         entity: 'Page',
      }
   }
});

/**
 * Serialize into json-able object
 * @returns {Object}
 */
Comment.prototype.serialize = function() {
   return {
      _id: this._id,
      text: this.text,
      author: this.author,
      created: this.created.getTime()
   }
};

/**
 * Removes comments with given id
 * @param {Array} deleteIds
 */
Comment.bulkRemove = function(deleteIds) {
   if (!deleteIds || !deleteIds.length) return false;

   deleteIds.forEach(function(did) {
      var c = Comment.query().equals('id', did).select()[0];
      log.info('removing comment _id ', did);
      c.remove();
   });
   return true;
};

/**
 * Create a comment
 * @static
 */
Comment.create = function(data) {
   if (data.page && data.text) {
      var comment = new Comment(data);
      comment.save();
      log.info('created comment @', data.page.path);
      return true;
   }
   return false;
};
