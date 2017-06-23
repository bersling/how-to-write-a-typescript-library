const mu = require('mu2');
const fs = require('fs');
const https = require('https');

console.log('=== COMPILE SASS ===');

var sass = require('node-sass');
var result = sass.renderSync({
  file: './src/css/styles.scss',
  outFile: './src/css/styles.css'
});
fs.writeFileSync('./src/css/styles.css', result.css);


console.log('=== BUILD SITEMAP && robots ===');
function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done(ex);
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

copyFile('./sitemap.xml', './dist/sitemap.xml', function(err) {
  if (err) {
    console.error('Error on copying sitemap.xml:', err);
  }
});
copyFile('./robots.txt', './dist/robots.txt', function(err) {
  if (err) {
    console.error('Error on copying robots', err);
  }
});

console.log('=== COMPILE MUSTACHE ===');
mu.root = __dirname + '/src';
const data = {};

const pages = ['index', 'unit-testing', 'local-consumer', 'angular2'];

pages.forEach(page => {
  const writeStream = fs.createWriteStream(`./dist/${page}.html`);
  mu.compileAndRender(`pages/${page}/${page}.html`, data)
      .on('data', function (data) {
        writeStream.write(data.toString());
      });
})


console.log('=== AMP VALIDATION ===');
const amphtmlValidator = require('amphtml-validator');

pages.forEach(page => {
  amphtmlValidator.getInstance().then(function (validator) {
    const input = fs.readFileSync(`dist/${page}.html`, 'utf8');
    const result = validator.validateString(input);
    ((result.status === 'PASS') ? console.log : console.error)(result.status);
    for (let ii = 0; ii < result.errors.length; ii++) {
      const error = result.errors[ii];
      let msg = 'line ' + error.line + ', col ' + error.col + ': ' + error.message;
      if (error.specUrl !== null) {
        msg += ' (see ' + error.specUrl + ')';
      }
      ((error.severity === 'ERROR') ? console.error : console.warn)(msg);
    }
  });
});
