var Walk = require('./walk');

console.log('-------------------------------------------------------------');
console.log('installing frontend modules...');
console.log('-------------------------------------------------------------');

Walk("./node_modules_frontend", "../client/node_modules", false, function(error) {
  if (error) {
    throw error;
  }
  else {
    console.log('-------------------------------------------------------------');
    console.log('frontend modules successfully installed.');
    console.log('-------------------------------------------------------------');
  }

  console.log('-------------------------------------------------------------');
  console.log('installing backend modules...');
  console.log('-------------------------------------------------------------');

  Walk("./node_modules_backend", "../node_modules", false, function(error) {
    if (error) {
      throw error;
    }
    else {
      console.log('-------------------------------------------------------------');
      console.log('backend modules successfully installed.');
      console.log('-------------------------------------------------------------');
    }

    console.log('-------------------------------------------------------------');
    console.log('installing backend special changed modules for offline...');
    console.log('-------------------------------------------------------------');

  });
});
