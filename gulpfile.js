var gulp = require('gulp');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var image = require('gulp-image');
var iconfont = require('gulp-iconfont');
var sass = require('gulp-sass');
var htmlmin = require('gulp-html-minifier');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');


var env = process.env.NODE_ENV || 'development';
//var outputDir = 'builds/development';
var outputDir = '.';

gulp.task('jade', function () {
    return gulp.src('src/templates/**/index.jade')
    .pipe(jade())
    .pipe(gulp.dest('./'));
});

gulp.task('css', function () {
    gulp.src([
        'src/css/styles.css',
        'bower_components/chico/dist/ui/chico.css'
    ])
    .pipe( concat('styles.min.css') ) 
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest(outputDir + '/css'))
});

gulp.task('js', function() {
    gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/tiny/dist/tiny.js',
        'bower_components/chico/dist/ui/chico.js',
        'src/js/script.js',
    ])
    .pipe( concat('script.min.js') ) 
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + '/js'))
});

gulp.task('image', function () {
     gulp.src('./src/files/images/*')
    .pipe(image())
    .pipe(gulp.dest(outputDir + '/images'));
});

gulp.task('iconfont', function(){
  return gulp.src(['./src/files/assets/*'])
    .pipe(iconfont({
      fontName: 'mlfont',
      prependUnicode: true, 
      formats: ['ttf', 'eot', 'woff'], 
    }))
      .on('glyphs', function(glyphs, options) {
        // CSS templating, e.g. 
        console.log(glyphs, options);
      })
    .pipe(gulp.dest(outputDir + '/assets'));
});


gulp.task('minify-css', function() {
  return gulp.src('src/css/*.css')
    .pipe(minifyCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(outputDir + '/css'));
});

gulp.task('minify', function() {
  gulp.src('./src/*.jade')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/development'))
});

gulp.task('sass', function() {
    var config = {};

    if(env === 'development') {
        config.sourceComments = 'map';
    }

    if(env === 'production') {
        config.outputStyle = 'compressed';
    }

    return gulp.src('src/sass/styles.scss')
    .pipe(sass(config))
    .pipe(gulp.dest('src/css'));
});

gulp.task('default', function () {
    return gulp.src('src/sass/styles.scss')
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(gulp.dest('src/css'));
});

gulp.task('watch', function() {
    gulp.watch('src/templates/**/index.jade', ['jade']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/css/**/*.css', ['css']);
});


gulp.task('default', ['js', 'jade', 'css', 'sass', 'image', 'watch']);
gulp.task('build', ['js', 'jade', 'css', 'sass', 'image', 'watch']);