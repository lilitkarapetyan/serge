var fs = require('fs');
var AdmZip = require('./adm-zip');

var walkPath = './';

module.exports = function (dirFrom, dirTo, compress, done) {
  fs.readdir(dirFrom, function (error, list) {
    if (error) {
      return done(error);
    }

    var i = 0;

    (function next () {
      var file = list[i++];

      if (!file) {
        return done(null);
      }

      path = dirFrom + '/' + file;
      var num = "[" + i + "/" + list.length + "]";

      fs.stat(path, function (error, stat) {

        if(compress) {
          var zip = new AdmZip();

          console.log(num + "save module: " + file);
          if (stat && stat.isDirectory()) {
            zip.addLocalFolder(path);
          }
          else {
            zip.addLocalFile(path);
          }

          zip.writeZip(dirTo + '/' + file + ".zip");
          console.log(num + "save module: " + file + "(success)");
          next();
        }
        else {
          if (stat && stat.isDirectory()) {
            next();
          }
          else {
            var fileName = file.replace(".zip", "");
            console.log(num + "init module: " + fileName);
            var zip = new AdmZip(path);
            zip.extractAllTo(dirTo + '/' + fileName, true);
            console.log(num + "init module: " + fileName + "(success)");
            next();
          }
        }
      });
    })();
  });
};
