/**
 * 縮放圖片並壓成一張
 */
var path = require('path');
var fs = require('fs');

var lwip = require('lwip');
var sprity = require('sprity');
var async = require('async');

var size = 40;
var name = 'flags_' + size + 'x' + size;
var flags_src = path.resolve(__dirname, 'flags_src');
var flags_tmp = path.resolve(__dirname, 'flags_tmp');
var outPath = path.resolve(__dirname, 'public');

function mkdir(path) {
  try {
    fs.mkdirSync(path);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.log(err);
      process.exit(1)
    }
  }
}

mkdir(flags_tmp)
mkdir(outPath)

function resize(flagName, cb) {
  var flagPath = path.resolve(flags_src, flagName)
  var tmpFlagPath = path.resolve(flags_tmp, flagName)
  lwip.open(flagPath, (err, image) => {
    image.batch()
      .resize(size)
      .writeFile(tmpFlagPath, cb);
  });
}

function compress() {
  var options = {
    src: flags_tmp + '/*.png',
    out: outPath,
    margin: 0,
    name: name,
    style: name + '.css',
    cssPath: '/public',
  };

  sprity.create(options, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('ok');
    }
  });
}

var flags = fs.readdirSync(flags_src).filter(s => s.endsWith('.png'));
async.map(flags, resize, (err, results) => {
  if (err) {
    console.log('error', err);
  } else {
    compress();
  }
});


