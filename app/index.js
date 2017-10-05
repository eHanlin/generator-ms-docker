var Generator = require('yeoman-generator');
var chalk = require('chalk');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    //generators.Base.apply(this, arguments);
    super(args, opts);

    this.PATH = ((function(){
      var 
      SOURCE = 'src',
      PROJECT_SOURCE = SOURCE + '/' + this.appname,
      RESOURCE = 'src/resource',
      COFFEE_SOURCE = SOURCE + '/webapp/coffee',
      TYPE_SCRIPT_SOURCE = SOURCE + '/webapp/typescript',
      LESS_SOURCE = SOURCE + '/webapp/less',
      JS_SOURCE = SOURCE + '/webapp/js',
      STATIC_RESOURCE_SOURCE = SOURCE + '/webapp/resource',
      WEBAPP = 'src/webapp',
      MIDDLE_MAPPING = '**/**/**/**/**/**',
      TMP = '.tmp',
      TMP_JS_PATH = TMP + '/js',
      TMP_CSS_PATH = TMP + '/css',
      TMP_STATIC_TMP_PATH = TMP + '/resource',
      TMP_MAPPING_SOURCE = TMP + '/' + MIDDLE_MAPPING,
      JS_MAPPING_SOURCE = JS_SOURCE + '/' + MIDDLE_MAPPING + '.js',
      TYPE_SCRIPT_MAPPING_SOURCE = TYPE_SCRIPT_SOURCE + '/' + MIDDLE_MAPPING + '.ts',
      LESS_MAPPING_SOURCE = LESS_SOURCE + '/' + MIDDLE_MAPPING + '.less',
      COFFEE_MAPPING_SOURCE = COFFEE_SOURCE + '/' + MIDDLE_MAPPING + '.coffee',
      PROJECT_CONFIG_RESOURCE = PROJECT_SOURCE + '/config';

      return {
        SOURCE:SOURCE,
        CURRENT_ENV: '.currentEnv',
        PROJECT_SOURCE:PROJECT_SOURCE,
        PROJECT_CONFIG_RESOURCE:PROJECT_CONFIG_RESOURCE,
        COFFEE_SOURCE:COFFEE_SOURCE,
        RESOURCE:RESOURCE,
        MIDDLE_MAPPING:MIDDLE_MAPPING,
        STATIC_RESOURCE_SOURCE:STATIC_RESOURCE_SOURCE,
        JS_MAPPING_SOURCE:JS_MAPPING_SOURCE,
        TYPE_SCRIPT_MAPPING_SOURCE:TYPE_SCRIPT_MAPPING_SOURCE,
        LESS_MAPPING_SOURCE:LESS_MAPPING_SOURCE,
        COFFEE_MAPPING_SOURCE:COFFEE_MAPPING_SOURCE,
        JS_SOURCE:JS_SOURCE,
        TYPE_SCRIPT_SOURCE:TYPE_SCRIPT_SOURCE,
        TMP_JS_PATH:TMP_JS_PATH,
        TMP_CSS_PATH:TMP_CSS_PATH,
        TMP_MAPPING_SOURCE:TMP_MAPPING_SOURCE,
        TMP_STATIC_TMP_PATH:TMP_STATIC_TMP_PATH,
        WEBAPP:WEBAPP
      };
    }).bind(this))();
  }

  packageJSON(){
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this
    );
  }

  gulpfile(){
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      this
    );
  }

  prompting() {
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
      message: 'What\'s your s3 backend\'s zip bucket?',
      when:whenS3,
      default: ''
    },
    {
      type: 'input',
      name: 'resourceBucket',
      message: 'What\'s your s3 resource\'s bucket?',
      when:whenS3,
      default: ''
    },
    {
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
 
    return this.prompt(prompts).then((answers)=> {
      this.REQUIRE = {
        S3:answers.isS3
      };
      this.ACCESS_KEY_ID = answers.accessKey;
      this.SECRET_ACCESS_KEY = answers.secretKey;
      this.ZIP_BUCKET = answers.bucket;
      this.RESOURCE_BUCKET = answers.resourceBucket;
      done();
    });

  }

  _getFlaskPath( file ){
    return 'src/' + this.appname + '/' + file;
  }

  app(){
    //this.mkdir(this.PATH.PROJECT_SOURCE);
    //this.mkdir(this.PATH.RESOURCE);
    this.fs.copyTpl(
      this.templatePath('config'),
      this.destinationPath(this.PATH.RESOURCE),
      this
    );
    this.fs.copyTpl(
      this.templatePath('flask/src'),
      this.destinationPath(this._getFlaskPath( '' )),
      this
    );
    this.fs.copy(this.templatePath('webapp'), this.PATH.WEBAPP);
    this.fs.copyTpl(
      this.templatePath('flask/entry_point.py'),
      this.destinationPath('src/app.py'),
      this
    );
    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore'),
      this
    );
    this.fs.copy(this.templatePath('flask/install.sh'), 'install.sh');
    this.fs.copyTpl(
      this.templatePath('flask/run.sh'),
      this.destinationPath('src/run.sh'),
      this
    );
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this
    );
    this.fs.write('.python-version', '3.4.3');
    this.fs.write(this.PATH.CURRENT_ENV, 'default');
  }

  install(){
    this.npmInstall();
  }
};
