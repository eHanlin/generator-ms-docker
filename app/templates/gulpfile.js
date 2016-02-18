var gulp = require('gulp'),
awspublish = require('gulp-awspublish'),
rename = require('gulp-rename'),
symlink = require('gulp-symlink'),
jsonnet = require('gulp-jsonnet'),
del = require('del'),
zip = require('gulp-zip'),
gutil = require('gulp-util'),
coffee = require('gulp-coffee'),
less = require('gulp-less'),
ts = require('gulp-typescript'),
jsonInjector = require('gulp-json-injector'),
fs = require('fs');

var pack = require('./package.json'),
PATH = <%- JSON.stringify(PATH, null, 2) %>,
ENV = fs.readFileSync(PATH.CURRENT_ENV, 'utf8').toString().trim();

<% if ( REQUIRE.S3 ) { %>
var ACCESS_KEY_ID = "<%= ACCESS_KEY_ID %>",
SECRET_ACCESS_KEY = "<%= SECRET_ACCESS_KEY %>",
ZIP_BUCKET = "<%= ZIP_BUCKET %>",
RESOURCE_BUCKET = "<%= RESOURCE_BUCKET %>";
<% } %>

PATH.SHARE_JSONNET = PATH.RESOURCE + '/shareConfig.jsonnet',
PATH.MAPPING_JSONNET = [
  PATH.RESOURCE + '/' + ENV + '/' + PATH.MIDDLE_MAPPING + '/*.jsonnet',
  PATH.SHARE_JSONNET
];

PATH.BUILD_PATH = "target";
PATH.BUILD_FRONTEND_PATH = PATH.BUILD_PATH + '/webapp';
PATH.BUILD_BACKEND_PATH = PATH.BUILD_PATH + '/<%= appname %>';
PATH.MAPPING_BUILD_BACKEND_PATH = PATH.BUILD_BACKEND_PATH + '/' + PATH.MIDDLE_MAPPING,
PATH.MAPPING_BUILD_ZIP_PATHS = [
  PATH.MAPPING_BUILD_BACKEND_PATH,
  PATH.BUILD_BACKEND_PATH + '/.python-version'
];

var VERSION = fs.readFileSync(PATH.SHARE_JSONNET, 'utf8').toString().match(/\"version\" *: *\"(\S+)\"/m)[1].trim(),
BUILDED_NAME = VERSION + (ENV != 'production' ? '-SNAPSHOT':'');

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
             .pipe(jsonInjector({
                inject:function(json, next, file){
                  if ( ENV != 'default' ) {
                    json.staticS3Host = "https://s3-ap-northeast-1.amazonaws.com";
                    json.staticUrlPath = "/ehanlin-web-resource/<%= appname %>/" + BUILDED_NAME;
                  }
                  next(json);
                }
              }))
             .pipe(gulp.dest(PATH.PROJECT_CONFIG_RESOURCE))
});

gulp.task('coffee', function(){
  return gulp.src( PATH.COFFEE_MAPPING_SOURCE )
             .pipe(coffee())
             .pipe(gulp.dest(PATH.TMP_JS_PATH));
});

gulp.task('typescript', function(){
  return gulp.src( PATH.TYPE_SCRIPT_MAPPING_SOURCE )
             .pipe(ts())
             .pipe(gulp.dest(PATH.TMP_JS_PATH));
});

gulp.task('less', function(){
  return gulp.src( PATH.LESS_MAPPING_SOURCE )
             .pipe(less())
             .pipe(gulp.dest(PATH.TMP_CSS_PATH));
});

gulp.task('js', function(){
  return gulp.src( PATH.JS_MAPPING_SOURCE )
             .pipe(gulp.dest(PATH.TMP_JS_PATH));
});

gulp.task('link:resource', function(){
  return gulp.src( PATH.STATIC_RESOURCE_SOURCE )
             .pipe( symlink(PATH.TMP_STATIC_TMP_PATH, {force: true}) );
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

gulp.task('watch', ['jsonnet', 'coffee', 'typescript', 'js', 'less', 'link:resource'], function(){
  gulp.watch(PATH.MAPPING_JSONNET, ['jsonnet']);
  gulp.watch(PATH.COFFEE_MAPPING_SOURCE, ['coffee']);
  gulp.watch(PATH.TYPE_SCRIPT_MAPPING_SOURCE, ['typescript']);
  gulp.watch(PATH.JS_MAPPING_SOURCE, ['js']);
  gulp.watch(PATH.LESS_MAPPING_SOURCE, ['less']);
});

gulp.task('copy:frontend',['jsonnet', 'clean', 'jsonnet', 'coffee', 'typescript', 'js', 'less', 'link:resource'], function(){
  return gulp.src([
    PATH.TMP_MAPPING_SOURCE,
    '!' + PATH.TMP_STATIC_TMP_PATH
  ]).pipe(gulp.dest(PATH.BUILD_FRONTEND_PATH));
});

gulp.task('copy:backend', ['jsonnet', 'clean'], function(){
  return gulp.src([
    PATH.SOURCE + '/app.py',
    PATH.PROJECT_SOURCE + '*/' + PATH.MIDDLE_MAPPING,
    '.python-version',
    'install.sh',
     PATH.SOURCE + '/run.sh' ])
     .pipe(gulp.dest( PATH.BUILD_BACKEND_PATH ))
});

gulp.task('build',['copy:backend', 'copy:frontend'], function(){
  return gulp.src(PATH.MAPPING_BUILD_ZIP_PATHS)
             .pipe(zip(BUILDED_NAME + '.zip'))
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
  return runPublisher( ZIP_BUCKET, [PATH.BUILD_PATH + '/' + BUILDED_NAME + '.zip'], function( path ){
    path.dirname = "<%= appname %>";
  });
});

gulp.task('publish:static', function(){
  return runPublisher( RESOURCE_BUCKET, [PATH.BUILD_FRONTEND_PATH + '/' + PATH.MIDDLE_MAPPING], function( path ){
    path.dirname = "<%= appname %>/" + BUILDED_NAME + "/" + path.dirname;
  });
});

<% } %>

