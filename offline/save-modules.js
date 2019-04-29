var AdmZip = require('./adm-zip');
var Walk = require('./walk');

console.log('-------------------------------------------------------------');
console.log('saving backend modules...');
console.log('-------------------------------------------------------------');

Walk("../node_modules", "./node_modules_backend", true, function(error) {
  if (error) {
    throw error;
  }
  else {
    console.log('-------------------------------------------------------------');
    console.log('backend modules successfully saved.');
    console.log('-------------------------------------------------------------');
  }

  console.log('-------------------------------------------------------------');
  console.log('saving frontend modules...');
  console.log('-------------------------------------------------------------');

  Walk("../client/node_modules", "./node_modules_frontend", true, function(error) {
    if (error) {
      throw error;
    }
    else {
      console.log('-------------------------------------------------------------');
      console.log('frontend modules successfully saved.');
      console.log('-------------------------------------------------------------');
    }

    // var zip = new AdmZip();
    // console.log("Write Zip: project");
    // zip.addLocalFolder("../");
    // zip.writeZip("../project.zip");
    // console.log("Write Zip: project (success)");
    // console.log("You can found it on project root directory");
    // console.log("myProjectFolder/project.zip");
  });
});
