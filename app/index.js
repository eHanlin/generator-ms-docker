var generators = require('yeoman-generator');
var chalk = require('chalk');

module.exports = generators.Base.extend({
  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);

    this.PATH = ((function(){
      var 
      SOURCE = 'src',
      PROJECT_SOURCE = SOURCE + '/' + this.appname,
      RESOURCE = 'src/resource',
      MIDDLE_MAPPING = '**/**/**/**/**/**',
      PROJECT_CONFIG_RESOURCE = PROJECT_SOURCE + '/config';

      return {
        SOURCE:SOURCE,
        CURRENT_ENV: '.currentEnv',
        PROJECT_SOURCE:PROJECT_SOURCE,
        PROJECT_CONFIG_RESOURCE:PROJECT_CONFIG_RESOURCE,
        RESOURCE:RESOURCE,
        MIDDLE_MAPPING:MIDDLE_MAPPING
      };
    }).bind(this))();
  },

  packageJSON:function(){
    this.template('_package.json', 'package.json');
  },

  gulpfile:function(){
    this.template('gulpfile.js');
  },

  prompting: function () {
    var done = this.async();
    var whenS3 = function(answers){
      return answers.isS3;
    };
    var prompts = [{
      type: 'confirm',
      name: 'isS3',
      message: 'Do you need to publish s3?',
      default: false
    },
    {
      type: 'input',
      name: 'bucket',
      message: 'What\'s your s3 zip bucket?',
      when:whenS3,
      default: ''
    },{
      type: 'input',
      name: 'accessKey',
      when:whenS3,
      message: 'What\'s your s3 access key?',
      default: ''
    },{
      type: 'input',
      name: 'secretKey',
      when:whenS3,
      message: 'What\'s your s3 secret key?',
      default: ''
    }];
 
    this.prompt(prompts, function (answers) {
      this.REQUIRE = {
        S3:answers.isS3
      };
      this.ACCESS_KEY_ID = answers.accessKey;
      this.SECRET_ACCESS_KEY = answers.secretKey;
      this.ZIP_BUCKET = answers.bucket;
      done();
    }.bind(this));

  },

  _getFlaskPath: function( file ){
    return 'src/' + this.appname + '/' + file;
  },

  app: function(){
    this.mkdir(this.PATH.PROJECT_SOURCE);
    this.mkdir(this.PATH.RESOURCE);
    this.directory('config', this.PATH.RESOURCE);
    this.directory('flask', this._getFlaskPath( '' ));
    this.template('entry_point.py', 'src/app.py');
    this.template('gitignore', '.gitignore');
    this.copy('install.sh');
    this.template('run.sh', 'src/run.sh');
    this.template('README.md');
    this.write('.python-version', '3.4.3');
    this.write(this.PATH.CURRENT_ENV, 'default');
  },

  install:function(){
    this.npmInstall();
  }
});
