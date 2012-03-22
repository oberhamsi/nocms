## NoCms

 * Flexibel URLs
 * Markdown
 * Easy customization
 * Comments per page
 * File upload

## Install

Install nocms and dependancies with [rp](https://github.com/grob/rp):

    $ rp install nocms

A nocms instance needs an empty directory where it will put its configuration file and where you can (optionally) overwrite the default templates:

    $ mkdir /var/www/nocms-foo/
    $ nocms create /var/www/nocms-foo/

nocms will ask you for the admin's username and password; the default installation configures your instance with a file-based H2 database, which is good enough for small sites.

### Optional: different database engine

If you want to use another database, modify `config.data.js` in your instance directory; e.g. this would be the config for a MySQL database:

    exports.store = {
       "url": "jdbc:mysql://localhost/foo-database",
       "driver": "com.mysql.jdbc.Driver",
       "username": "foo-user",
       "password": "foo-password"
    };

## Usage

Launch your instance with:

    $ nocms serve /var/www/nocms-foo/

You will be greated by a 404 at <http://localhost:8080/> because no pages exist yet.

Attach `!edit` to the URL of the page to get to the backend. For example:

 * <http://localhost:8080/!edit>
 * <http://localhost:8080/foo/bar/does/not/yet/exist/!edit>

### Keyboard shorcuts

  * CTRL+s    save

### Upload files

Attach `!files` to any URL

<http://localhost:8080/!files>
