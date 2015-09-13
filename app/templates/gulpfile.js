var gulp = require('gulp'),
awspublish = require('gulp-awspublish'),
rename = require('gulp-rename'),
symlink = require('gulp-symlink'),
jsonnet = require('gulp-jsonnet'),
del = require('del'),
zip = require('gulp-zip'),
gutil = require('gulp-util'),
fs = require('fs');

var pack = require('./package.json'),
PATH = <%- JSON.stringify(PATH) %>,
ENV = fs.readFileSync(PATH.CURRENT_ENV, 'utf8').toString().trim();

<% if ( REQUIRE.S3 ) { %>
var ACCESS_KEY_ID = "<%= ACCESS_KEY_ID %>",
SECRET_ACCESS_KEY = "<%= SECRET_ACCESS_KEY %>",
ZIP_BUCKET = "<%= ZIP_BUCKET %>";
<% } %>

PATH.SHARE_JSONNET = PATH.RESOURCE + '/shareConfig.jsonnet',
PATH.MAPPING_JSONNET = [
  PATH.RESOURCE + '/' + ENV + '/' + PATH.MIDDLE_MAPPING + '/*.jsonnet',
  PATH.SHARE_JSONNET
];

PATH.BUILD_PATH = "target";
PATH.BUILD_BACKEND_PATH = PATH.BUILD_PATH + '/<%= appname %>';
PATH.MAPPING_BUILD_BACKEND_PATH = PATH.BUILD_BACKEND_PATH + '/' + PATH.MIDDLE_MAPPING,
PATH.MAPPING_BUILD_ZIP_PATHS = [
  PATH.MAPPING_BUILD_BACKEND_PATH,
  PATH.BUILD_BACKEND_PATH + '/.python-version'
];

var VERSION = fs.readFileSync(PATH.SHARE_JSONNET, 'utf8').toString().match(/\"version\" *: *\"(\S+)\"/m)[1].trim();

var stringSrc = function(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    var file = new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) });
    this.push(file);
    this.push(null);
  }
  return src;
};

var changeENV = function( env ){
  return stringSrc(PATH.CURRENT_ENV, env).pipe(gulp.dest(''))
};

gulp.task('clean', function( cb ){ del( [PATH.BUILD_PATH], cb ); });

gulp.task('jsonnet', function(){
  return gulp.src( PATH.MAPPING_JSONNET )
             .pipe(jsonnet())
             .pipe(gulp.dest(PATH.PROJECT_CONFIG_RESOURCE))
});

gulp.task('env', function(){
  return changeENV('default');
});

gulp.task('env:test', function(){
  return changeENV('test');
});

gulp.task('env:production', function(){
  return changeENV('production');
});

gulp.task('watch', ['jsonnet'], function(){
  gulp.watch(PATH.MAPPING_JSONNET, ['jsonnet']);
});

gulp.task('copy:backend', ['jsonnet', 'clean'], function(){
  return gulp.src([
    PATH.SOURCE + '/app.py',
    PATH.PROJECT_SOURCE + '/' + PATH.MIDDLE_MAPPING,
    '.python-version',
    'install.sh',
     PATH.SOURCE + '/run.sh' ])
     .pipe(gulp.dest( PATH.BUILD_BACKEND_PATH ))
});

gulp.task('build',['copy:backend'], function(){
  return gulp.src(PATH.MAPPING_BUILD_ZIP_PATHS)
             .pipe(zip(VERSION + '.zip'))
             .pipe(gulp.dest(PATH.BUILD_PATH));
});

gulp.task('default', ['build']);

<% if ( REQUIRE.S3 ) { %>
var runPublisher = function( bucket, paths, renameCB ){

  var publisher = awspublish.create({
    params: {
      Bucket: bucket
    },
    accessKeyId:ACCESS_KEY_ID,
    secretAccessKey:SECRET_ACCESS_KEY
  });

  return gulp.src( paths )
      .pipe(rename(renameCB))
      .pipe(publisher.publish())
      .pipe(awspublish.reporter());
};


gulp.task('publish:zip', function(){
  return runPublisher( ZIP_BUCKET, [PATH.BUILD_PATH + '/' + VERSION + '.zip'], function( path ){
    path.dirname = "<%= appname %>";
  });
});

<% } %>

