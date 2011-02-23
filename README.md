## NoCms

Content managment for lazy people.

 * Flat pages
  * flexibel URLs
  * markdown
 * Comments

## Install

Requires <http://Ringojs.org> and a MySQL5+ (or other database supported ringo-sqlstore).

1) Install stick & ringo-sqlstore:

    ringo-admin install ringo/stick
    ringo-admin install grob/ringo-sqlstore

You might need the MySQL JDBC driver:

  * download: <http://dev.mysql.com/downloads/connector/j/5.0.html>
  * rename the jar file to 'mysql.jar'
  * put it into `ringo-sqlstore/jars/` directory

2) Create database & user:

    create database nocms;
    CREATE USER 'nocms'@'localhost' identified by 'nocms';
    GRANT ALL PRIVILEGES ON nocms.* TO 'nocms'@'localhost';

3) Create upload folder and make writable & readable for Ringo server:

    mkdir public/files
    chmod 777 public/files

4) Create config. Copy template config and adapt to your setup

    cp config-example.js config.js
    nano config.js


## Usage

Start with:

    ringo main.js

You will be greated by a 404 at <http://localhost:8080/> because no pages exist yet.

### Edit or create pages

Attach `!edit` to the URL of the page:

 * <http://localhost:8080/!edit>
 * <http://localhost:8080/foo/bar/does/not/yet/exist/!edit>

Comments are listed at the buttom of the edit page: mark checkbox of comment do delete them.

Keyboard shorcuts:

  * CTRL+S save
  * CTRL+P update preview

### Upload images

Attach `!files` to any URL

<http://localhost:8080/!files>
